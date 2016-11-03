var express = require('express');
var router = express.Router();
var auth = require('./auth');
var apiCall = require('./apicall');
var db = require('seraph')({
	server: process.env.SERVER_URL || 'http://localhost:7474/', // 'http://studionetdb.design-automation.net'
	user: process.env.DB_USER,
	pass: process.env.DB_PASS
});


// might change routes to use a better middleware

// route: /api/groups/
router.route('/')

	// return all groups
	.get(auth.ensureAuthenticated, function(req, res){
		
		// return only name and id associated with each group
		var query = [
			'MATCH (g:group) WITH g',
			'RETURN {name: g.name, id: id(g)}'
		].join('\n');


		/*
		var query = [
			'MATCH (g:group) WITH g',
			'MATCH (g)-[r:MEMBER]->(u:user)',
			'RETURN {' +
								'name: g.name, description: g.description' +
								'id: id(g), + users: collect({id: id(u), role: r.role })}'
		].join('\n');
		*/

		db.query(query, function(error, result){
			if (error)
				console.log('Error retrieving all groups: ', error);
			else
				res.send(result);
		});

	})

	// create a new group
	.post(auth.ensureAuthenticated, function(req, res){
		// TODO: more details for a group?
		// avatar, etc.

		var groupExists; console.log(req.body); console.log(req.body.name);
		// Param setup
		var params = {
			nameParam: req.body.name,
			descriptionParam: req.body.description,
			restrictedParam: req.body.restricted,
			groupParentIdParam: req.body.groupParentId,
			userIdParam: req.user.id
		};

		// Query to check if group already exists
		var query = [
			'MATCH (g:group {name: {nameParam}})',
			'RETURN count(g)'
		].join('\n');

		// actual check if group already exists
		db.query(query, params, function(error, result){
			if (error)
				console.log('Error looking for the group in database: ', error);
			else {
				groupExists = result;
			}
		});

		// if group already exists, return
		if (groupExists) {
			// not sure what to feedback to the frontend for this
			// if already exists
			res.send("The group with name " + req.body.name + " already exists in the database!");
			return;
		}

		// else try to create the group (link group to its tag, and add owner as admin to group)
		query = [
			'CREATE (g:group {name: {nameParam}, description: {descriptionParam}, restricted: {restrictedParam}})',
			'WITH g',
			'MATCH (u:user) WHERE id(u)= {userIdParam}',
			'CREATE UNIQUE (g)-[r:MEMBER {role: "Admin"}]->(u)',
			'MERGE (t:tag {name: {nameParam}})',
			'WITH g, t',
			'CREATE UNIQUE (g)-[r1:TAGGED]->(t)',
		];

		if (req.body.groupParentId != -1) {
			// the group has a parent group
			query.push('WITH g');
			query.push('MATCH (g1:group) WHERE id(g1)= {groupParentIdParam}');
			query.push('CREATE UNIQUE (g1)-[r2:SUBGROUP]->(g)');
		}

		query.push('RETURN g');
		query = query.join('\n');

		// Actual creating of group using above query
		db.query(query, params, function(error, result){
			if (error)
				console.log('Error occured while creating the group in the database: ', error);
			else
				// return the first item because query always returns an array but REST API expects a single object
				res.send(result[0]);
		});

	});

// route: /api/groups/:groupId
router.route('/:groupId')

	// returns a particular group
	.get(auth.ensureAuthenticated, function(req, res){

		var query = [
			'MATCH (g:group) WHERE ID(g) = {groupIdParam}',
			'RETURN g'
		].join('\n');

		var params = {
			groupIdParam : req.params.groupId
		};

		db.query(query, params, function(error, result){
			if (error)
				console.log('Error retreiving group ' + req.params.groupId + ':', error);
			else
				res.send(result[0]);

		});

	})

	// updates an existing group
	.put(auth.ensureAuthenticated, auth.ensureSuperAdmin, function(req, res){
		var query = [
			'MATCH (g:group)',
			'WHERE ID(g)=' + req.params.groupId,
			'WITH g',
			'SET g.name={nameParam}, g.code={codeParam}, g.contributionTypes={typesParam}',
			'RETURN g'
		].join('\n');

		/*
		if (req.body.name)
			query.push('SET m.name={nameParam}');
		if (req.body.code)
			query.push('SET m.code={codeParam}');
		if (req.body.contributionTypes)
			query.push('SET m.contributionTypes={typesParam}');

		query.push('RETURN m');
		query.join('\n');
		*/

		var params = {
			nameParam: req.body.name,
			codeParam: req.body.code,
			typesParam: req.body.contributionTypes
		};

		db.query(query, params, function(error, result){
			if (error)
				console.log('Error updating group with id ' + req.params.groupId + ' : ', error);
			else
				// return the first item because query always returns an array but REST API expects a single object
 				res.send(result[0]);
		});

	})

	// deletes an existing group
	.delete(auth.ensureAuthenticated, auth.ensureSuperAdmin, function(req, res){
		var query = [
			'MATCH (g:group)',
			'WHERE ID(g)=' + req.params.groupId,
			'DELETE g'
		].join('\n');

		db.query(query, function(error, result){
			if (error)
				console.log('Error deleting group with id ' + req.params.groupId + ' : ', error);
			else
				// return the first item because query always returns an array but REST API expects a single object
				res.send(result[0]);
		})
	});


// route: /api/groups/:groupId/users
router.route('/:groupId/users')
	
	// get all users for this group (all roles)
	.get(auth.ensureAuthenticated, auth.isStudent, function(req, res){
		
		var query = [
			'MATCH (g:group) WHERE ID(g) = {groupIdParam}',
			'WITH g',
			'MATCH (g)-[r:MEMBER]->(u:user)',
			'RETURN {name: u.name, id: id(u)}'
		].join('\n');

		var params = {
			groupIdParam: req.params.groupId
		};

		db.query(query, params, function(error, result){
			if (error)
				console.log('Error fetching list of users for group ', req.params.groupId, error);
			else
				res.send(result);
		});

	})

	// link the user with this module
	/*.post(auth.ensureAuthenticated, auth.isModerator, function(req, res){
		var query = [
			'MATCH (u:user) WHERE ID(u)=' + req.body.userId + ' WITH u',
			'MATCH (m:module) WHERE ID(m)=' + req.body.moduleId,
			'CREATE UNIQUE (m)-[r:MEMBER{role: {roleParam}}]->(u)'
		].join('\n');
		console.log("i am here query"+query);
		var params = {
			roleParam: req.body.moduleRole
		};

		db.query(query, params, function(error, result){
			if (error)
				console.log('Error linking the user to the module');
			else
				res.send('success');
		});
	})
*/
	.post(auth.ensureAuthenticated, auth.isModerator, function(req, res){
		var query = [
			'MATCH (u:user) WHERE ID(u)=' + req.body.userId + ' WITH u',
			'MATCH (g:group) WHERE ID(g)=' + req.body.groupId,
			'CREATE UNIQUE (g)-[r:MEMBER{role: {roleParam}}]->(u)'
		].join('\n');
		console.log("i am here query"+query);
		var params = {
			roleParam: req.body.groupRole
		};

		db.query(query, params, function(error, result){
			if (error)
				console.log('Error linking the user to the group');
			else
				res.send('success');
				
		});
	});


// route: /api/groups/:groupId/users/:userId
router.route('/:groupId/users/:userId')
	// edit the user's role in this group
	.put(auth.ensureAuthenticated, auth.isModerator, function(req, res){
		var query = [
			'MATCH (g:group)-[r:MEMBER]->(u:user)',
			'WHERE ID(g)=' + req.params.groupId + ' AND ID(u)=' + req.params.userId,
			'SET r.role = {roleParam}'
		].join('\n');

		var params = {
			roleParam: req.body.groupRole
		};

		db.query(query, params, function(error, result){
			if (error)
				console.log('Error editting role of user for this group');
			else
				res.send('success');
		});
	})



module.exports = router;
