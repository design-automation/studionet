var express = require('express');
var router = express.Router();
var auth = require('./auth');
var apiCall = require('./apicall');
var db = require('seraph')({
	server: process.env.SERVER_URL || 'http://localhost:7474/', // 'http://studionetdb.design-automation.net'
	user: process.env.DB_USER,
	pass: process.env.DB_PASS
});

// route: /api/contributions
router.route('/')
	// get all contributions
	.get(function(req, res){
		res.send('placeholder response');
	})

	// create a new contribution linked to the current user
	.post(auth.ensureAuthenticated, function(req, res){

		var query = [
			'CREATE (c:contribution {title: {contributionTitleParam}, body: {contributionBodyParam},' +
			                         'ref: {contributionRefParam}, lastUpdated:{lastUpdatedParam},' +
			                         'dateCreated: {dateCreatedParam}, editted: {edittedParam},' +
			                         'labels: {contributionLabelParam}, contributionTypes: {contributionTypesParam}}) WITH c',
			'MATCH (u:user) WHERE id(u)=' + req.user.id,
			'CREATE (u)-[r:CREATED]->(c)'
		];

		// if not linked to anything, put -1
		// reference type: REPLYTO, 
		if (parseInt(req.body.ref) !== -1){
			query.push('MATCH (c1:contribution) where id(c1)={contributionRefParam}')
			query.push('CREATE (c)-[r1:{refTypeParam}]->(c1)')
		}

		query = query.join('\n');

		var date = Date.now();

		var params = {
			contributionTitleParam: req.body.title,
			contributionBodyParam: req.body.body,
			contributionRefParam: req.body.ref, 
			lastUpdatedParam: date,
			dateCreatedParam: date,
			refTypeParam: req.body.refType,
			edittedParam: false,
			contributionLabelParam: req.body.labels, //tags
			contributionTypesParam: req.body.contributionTypes,
			contributionDescriptionParam: 'This is a short description of the post', 
			contributionContentParam: 'Lorem ipsum Eiusmod velit amet irure voluptate elit nulla qui aliquip voluptate occaecat minim culpa eiusmod.'
		};

		db.query(query, params, function(error, result){
			if (error)
				console.log('Error creating new post for user : ' + req.user.nusOpenId);
			else
				res.send(result[0]);
		});

	});


// route: /api/contributions/:contributionId
router.route('/:contributionId')
	.get(auth.ensureAuthenticated, function(req, res){

		var query = [
			'MATCH (c:contribution) WHERE ID(c)=' + req.params.contributionId,
			'RETURN c'
		].join('\n');

		db.query(query, function(error, result){
			if (error)
				console.log('Error fetching contribution of id: ' + req.params.contributionId);
			else
				res.send(result[0]);
		});

	})

	.put(auth.ensureAuthenticated, function(req, res){

		// TODO:
		// check contribution ref and also if this contribution even belongs to current user.
		var query = [
			'MATCH (c:contribution) WHERE ID(c)=' + req.params.contributionId,
			'RETURN c'
		].join('\n');

		var params;

		var oldRef; // previous ref of the contribution

		// Check the current contribution ref
		db.query(query, function(error, result){
			oldRef = result[0].ref;
		});

		if (oldRef !== req.body.ref){
			// If edit reference
			// Pass to relationship routes
			// Case 1: From -1 to something (create the relationship)
			if(oldRef == -1){
				query = [
					'MATCH (c:contribution) WHERE ID(c)={contributionIdParam}',
					'MATCH (c1:contribution) WHERE ID(c1)={contributionRefParam}',
					'CREATE (c)-[r:{refTypeParam}]->(c1)'
				].join('\n');

				params = {
					contributionIdParam: req.params.contributionId,
					contributionRefParam: req.body.ref,
					refTypeParam: req.body.refType
				}

				db.query(query, params, function(error,result){
					if (error)
						res.send('error creating relationship when editting contribution');
				});

			}
			
			// Case 2: From something to -1 (delete the relationship)
			else {
				query = [
					'MATCH (c:contribution) WHERE ID(c)={contributionIdParam}',
					'MATCH (c1:contribution) WHERE ID(c1)={contributionRefParam}',
					'MATCH (c)-[r:{refTypeParam}]->(c1)',
					'DELETE r'
				].join('\n');

				params = {
					contributionIdParam: req.params.contributionId,
					contributionRefParam: req.body.ref,
					refTypeParam: req.body.refType
				}

				db.query(query, params, function(error,result){
					if (error)
						res.send('error creating relationship when editting contribution');
				});


			}

		}

		query = [
			'MATCH (c:contribution) WHERE ID(c)={contributionIdParam}',
			'SET c.title = {contributionTitleParam}',
			'SET c.body = {contributionBodyParam}',
			'SET c.ref = {contributionRefParam',
			'SET c.lastUpdated = {lastUpdatedParam}',
			'SET c.editted = {edittedParam}',
			'SET c.labels = {contributionLabelParam}',
			'SET c.contributionTypes = {contributionTypesParam}'
		].join('\n');

		var params = {
			contributionIdParam: req.params.contributionId,
			contributionTitleParam: req.body.title,
			contributionBodyParam: req.body.body,
			lastUpdatedParam: Date.now(),
			edittedParam: true,
			contributionRefParam: req.body.ref, 
			contributionLabelParam: req.body.labels, //tags
			contributionTypesParam: req.body.contributionTypes
		};

		db.query(query, params, function(req, res){
			if (error)
				res.send('error editting the contribution');
			else
				res.send('success');
		});
	}) 

	.delete(auth.ensureAuthenticated, function(req, res){

		// TODO:
		// check if i own the contribution before deleting it

		var query = [
			'MATCH (c:contribution) WHERE ID(c)= {contributionIdParam}',
			'MATCH (u:user) WHERE ID(u)={userIdParam}',
			'MATCH (u)-[r:CREATED]->(c)',
			'DELETE r',
			'DELETE c'
		].join('\n');

		var params = {
			contributionIdParam: req.params.contributionId,
			userIdParam: req.user.id
		};

		db.query(query, params, function(error, result){
			if (error)
				console.log('Error deleting contribution id for this user. Check if this contribution is created by this user.');
			else
				res.send('success');
		});
	});




router.route('/:contributionId/connections');

router.route('/:contributionId/connections/:connectionId');



module.exports = router;