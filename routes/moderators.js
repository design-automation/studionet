var express = require('express');
var router = express.Router();
var auth = require('./auth');
var db = require('seraph')({
	server: process.env.SERVER_URL || 'http://localhost:7474/', // 'http://studionetdb.design-automation.net'
	user: process.env.DB_USER,
	pass: process.env.DB_PASS
});

// create a new moderator from scratch; user did not exist in db
router.post('/new', auth.ensureAuthenticated, auth.ensureSuperAdmin, function(req, res){

	var query = [
		'CREATE (u:user {name: {nameParam}, nusOpenId: {nusOpenIdParam}, canEdit: {canEditParam}, year: {yearParam}, lastLoggedIn: {lastLoggedInParam}, superAdmin: {superAdminParam}})',
		'WITH u',
		'MATCH (m:module) WHERE ID(m)={moduleIdParam}',
		'CREATE (m)-[r:MEMBER {role: "Admin"}]->(u)',
		'RETURN r'
	].join('\n');

	var params = {
		nameParam: req.body.name,
		nusOpenIdParam: req.body.nusOpenId,
		canEditParam: req.body.canEdit,
		moduleIdParam: req.body.moduleId,
		yearParam: req.body.year,
		lastLoggedInParam: Date.now(),
		superAdminParam: false
	};

	db.query(query, params, function(error, result){
		if (error){
			console.log('Error adding new moderator to the database: ', error);
		}
		else
			res.send(result[0]);
	});

});

// create a new moderator by adding new relationship; user already exists in db
router.post('/existing', auth.ensureAuthenticated, auth.ensureSuperAdmin, function(req, res){

	var query = [
		'MATCH (u:user {nusOpenId: {nusOpenIdParam}})',
		'WITH u',
		'MATCH (m:module) WHERE ID(m)={moduleIdParam}',
		'CREATE (m)-[r:MEMBER {role:"Admin"}]->(u)',
		'RETURN r'
	].join('\n');

	var params = {
		nusOpenIdParam: req.body.nusOpenId,
		moduleIdParam: req.body.moduleId
	}

	db.query(query, params, function(error, result){
		if (error)
			console.log('Error adding existing user as moderator: ', error);
		else
			res.send(result[0]);
	})
});

module.exports = router;