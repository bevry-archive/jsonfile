import { equal, expectErrorViaCallback } from 'assert-helpers'
import kava from 'kava'
import readJSON, { writeJSON } from './index.js'

import { resolve } from 'path'
import filedirname from 'filedirname'
const [file, dir] = filedirname()
const pkgFile = resolve(dir, '..', 'package.json')
const missingFile = resolve(dir, '..', 'no-exist')

kava.suite('jsonfile', function (suite, test) {
	let pkg: object
	test('success works correctly', function (done) {
		readJSON(pkgFile)
			.then(function (data) {
				pkg = data
				done()
			})
			.catch(done)
	})
	test('failure works correctly on non-existent fil', function (done) {
		readJSON(missingFile)
			.then(() => done(new Error('this test should have failed')))
			.catch(
				expectErrorViaCallback(
					'invalid access',
					'should fail on non-existent file',
					done
				)
			)
	})
	test('failure works correctly on non-json file', function (done) {
		readJSON(file)
			.then(() => done(new Error('this test should have failed')))
			.catch(
				expectErrorViaCallback(
					'failed to parse',
					'should fail on non-json file',
					done
				)
			)
	})
	test('write works successfully', function (done) {
		writeJSON(pkgFile, pkg)
			.then(() => done())
			.catch(done)
	})
})
