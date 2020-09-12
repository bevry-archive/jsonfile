import { access, readFile, writeFile, constants } from 'fs'
import Errlop from 'errlop'

/** Turn the input into a JSON string */
export function stringifyJSON(contents: any): string {
	return JSON.stringify(contents, null, '  ')
}

/**
 * Parse the input string as JSON
 * @throws if invalid
 */
export function parseJSON<T extends object>(contents: any): T {
	if (contents == null)
		throw new Error(`contents were nullish, so unable to parse as JSON`)
	try {
		return JSON.parse(contents)
	} catch (err) {
		throw new Errlop(
			`contents were invalid JSON:\n${stringifyJSON(contents)}`,
			err
		)
	}
}

/** Read and parse the input file as JSON */
export function readJSON<T extends object>(path: string): Promise<T> {
	return new Promise<T>(function (resolve, reject) {
		access(path, constants.R_OK, function (err) {
			if (err)
				return reject(
					new Errlop(`invalid access to read json file at: ${path}`, err)
				)
			readFile(path, { encoding: 'utf8' }, function (err, str) {
				if (err)
					return reject(new Errlop(`failed to read json file at: ${path}`, err))

				let data: T
				try {
					data = parseJSON<T>(str)
				} catch (err) {
					return reject(
						new Errlop(`failed to parse as JSON the file at: ${path}`, err)
					)
				}
				return resolve(data)
			})
		})
	})
}

/** Write the contents as a JSON file */
export function writeJSON(
	path: string,
	data: any,
	mode?: number
): Promise<void> {
	return new Promise(function (resolve, reject) {
		const str = stringifyJSON(data)
		writeFile(path, str, { encoding: 'utf8', mode }, function (err) {
			if (err)
				return reject(new Errlop(`failed to write json file at: ${path}`, err))
			return resolve()
		})
	})
}

export default readJSON
