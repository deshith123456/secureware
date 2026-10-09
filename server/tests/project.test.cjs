const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
test('Project contains all required module paths',()=>{const source=read('client/src/main.jsx');for(const name of ['Overview','Courses & Quizzes','Policies','Phishing Campaigns','Password Tester','Compliance & Reports','User Management','Organization Structure','Notifications','Profile & Settings'])assert.ok(source.includes(name),name)});
test('PostgreSQL schema declares core integrity records',()=>{const source=read('server/schema.sql');for(const table of ['users','sessions','policies','policy_versions','acknowledgments','courses','questions','assignments','attempts','evidence','extensions','points','campaigns','audit'])assert.match(source,new RegExp('CREATE TABLE IF NOT EXISTS '+table+'\\('))});
test('Password Tester remains an integration point',()=>{assert.match(read('client/src/main.jsx'),/Source integration pending/)});
test('API contains server-side quiz scoring and session MFA gate',()=>{const s=read('server/index.mjs');assert.match(s,/score=total\?/);assert.match(s,/mfa_verified/);assert.match(s,/Cannot review|canReview/)});
test('Seed AUP excludes academic cover',()=>{const s=read('seed/aup.txt');assert.match(s,/Purpose & Scope/);assert.ok(!s.includes('SRI LANKA INSTITUTE OF INFORMATION TECHNOLOGY'))});
