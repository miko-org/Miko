/* eslint-disable no-async-promise-executor */
import https from 'https';
import fs from 'fs';
import os from 'os';

import extract from 'extract-zip';
import { resolve } from 'path';
import { Logger } from 'tslog';
import { Translations } from '@crowdin/crowdin-api-client';
import { glob } from 'glob';

import { crowdin } from '../config.json';

const logger = new Logger({ name: 'Localiztion' });

const tempPath = os.tmpdir();
const zipFilePath = resolve(tempPath, './translations.zip');
const extractPath = resolve(tempPath, './translations');

const PROJECT_ID = crowdin.projectId;
const API = new Translations({
	token: crowdin.token
});

const downloadTranslations = () =>
	new Promise(async (res, rej) => {
		const build = await API.listProjectBuilds(PROJECT_ID);

		const download = await API.downloadTranslations(PROJECT_ID, build.data[0].data.id);
		const stream = fs.createWriteStream(zipFilePath);

		stream.on('finish', res);
		stream.on('error', rej);

		https.get(download.data.url, response => response.pipe(stream));
	});

const getJson = (languagePath: string, service: string) => {
	const jsons = glob.sync(`${resolve(languagePath, service)}/**/*.json`);
	const json = {};

	jsons.forEach((jsonPath: string) => Object.assign(json, JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))));

	return json;
};

const saveJson = (service: string, language: string, json: Object) => {
	fs.writeFileSync(
		resolve(__dirname, `../apps/${service}/${service === 'web' ? 'app' : 'src'}/i18n/${language}.json`),
		JSON.stringify(json, null, 4),
		{
			encoding: 'utf-8'
		}
	);
};

const composeJson = () => {
	for (const language of fs.readdirSync(extractPath)) {
		const languagePath = resolve(extractPath, language);
		const shared = getJson(languagePath, 'Shared');

		for (const service of fs.readdirSync(languagePath).filter(x => x !== 'Shared')) {
			saveJson(service.toLowerCase(), language, {
				...shared,
				...getJson(languagePath, service)
			});

			logger.info(`Saved ${language.toUpperCase()} language of service ${service}!`);
		}
	}
};

const updateLanguages = async () => {
	logger.info('Trying to download latest translation strings...');
	await downloadTranslations();

	logger.info('Translations dowloaded. Extracting...');
	await extract(zipFilePath, { dir: extractPath });

	logger.info('Extracted... Time to composing files and saving!');
	composeJson();

	logger.info(`Ok, all saved, time to flush temp!`);
	[zipFilePath, extractPath].forEach(path =>
		fs.statSync(path).isDirectory() ? fs.rmdirSync(path, { recursive: true }) : fs.unlinkSync(path)
	);

	logger.info(`Languages updated!`);
};

updateLanguages();