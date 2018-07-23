var rdfstore = require('rdfstore');

//nodejs only
var _store ;
new Store({name:'test', overwrite:true}, function(err,store) {
    _store = store;
    store.load(
		'text/n3',
		'@prefix test: <http://test.com/> .\
		 test:A test:prop 5.\
		 test:B test:prop 4.\
		 test:C test:prop 1.\
		 test:D test:prop 3.',
		function(err) {

			var invoked = false;
            // instead of 'my_addition_check' a full URI can be used 'http://test.com/my_fns/my_addition_check'
			store.registerCustomFunction('my_addition_check', function(engine,args) {
            // equivalent to var v1 = parseInt(args[0].value), v2 = parseInt(args[1].value);

            var v1 = engine.effectiveTypeValue(args[0]);
            var v2 = engine.effectiveTypeValue(args[1]);

            // equivalent to return {token: 'literal', type:"http://www.w3.org/2001/XMLSchema#boolean", value:(v1+v2<5)};

            return engine.ebvBoolean(v1+v2<5);
	});

	   store.execute(
				'PREFIX test: <http://test.com/> \
				 SELECT * { ?x test:prop ?v1 .\
							?y test:prop ?v2 .\
							filter(custom:my_addition_check(?v1,?v2)) }',
				function(err) {
                   console.log(arguments);
                    /*test.ok(results.length === 3);
                    for(var i=0; i<results.length; i++) {
                        test.ok(parseInt(results[i].v1.value) + parseInt(results[i].v2.value) < 5 );
                    }
                    test.done()*/
                }
	);
  });
});

jsonld = {
    "@context":
    {
       "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
       "xsd": "http://www.w3.org/2001/XMLSchema#",
       "name": "http://xmlns.com/foaf/0.1/name",
       "age": {"@id": "http://xmlns.com/foaf/0.1/age", "@type": "xsd:integer" },
       "homepage": {"@id": "http://xmlns.com/foaf/0.1/homepage", "@type": "xsd:anyURI" },
       "ex": "http://example.org/people/"
    },
    "@id": "ex:john_smith",
    "name": "John Smith",
    "age": "41",
    "homepage": "http://example.org/home/"
  };

_store.setPrefix("ex", "http://example.org/people/");

_store.load("application/ld+json", jsonld, "ex:test", function(err,results) {
_store.node("ex:john_smith", "ex:test", function(err, graph) {
    console.log(arguments);
});
});


_store.execute('INSERT DATA {  <http://example/person1> <http://xmlns.com/foaf/0.1/name> "Celia" }', function(err){

_store.registerDefaultProfileNamespaces();

_store.execute('SELECT * { ?s foaf:name ?name }', function(err,results) {
        console.log("inserting", arguments);
    });
});


/* // in the browser the rdfstore object
// is already defined

// alt 1
rdfstore.create(function(err, store) {
  // the new store is ready
    
  var graph = store.rdf.createGraph();
graph.addAction(store.rdf.createAction(store.rdf.filters.p(store.rdf.resolve("foaf:name")),
								 function(triple){ var name = triple.object.valueOf();
												   var name = name.slice(0,1).toUpperCase()
												   + name.slice(1, name.length);
												   triple.object = store.rdf.createNamedNode(name);
												   return triple;}));

store.rdf.setPrefix("ex", "http://example.org/people/");
graph.add(store.rdf.createTriple( store.rdf.createNamedNode(store.rdf.resolve("ex:Alice")),
								  store.rdf.createNamedNode(store.rdf.resolve("foaf:name")),
								  store.rdf.createLiteral("alice") ));

var triples = graph.match(null, store.rdf.createNamedNode(store.rdf.resolve("foaf:name")), null).toArray();

console.log("worked? "+(triples[0].object.valueOf() === 'Alice'));
  
  
  store.execute('LOAD <http://dbpedialite.org/titles/Lisp_%28programming_language%29>\
                    INTO GRAPH <lisp>', function(err){
        if(err) {
            var query = 'PREFIX foaf:<http://xmlns.com/foaf/0.1/> SELECT ?o \
                FROM NAMED <lisp> { GRAPH <lisp> { ?s foaf:page ?o} }';
            store.execute(query, function(err, results) {
                console.log("item", results);
            });
        }
    });

    var query = "CONSTRUCT { <http://example.org/people/Alice> ?p ?o } \
    WHERE { <http://example.org/people/Alice> ?p ?o  }";
    
    store.execute(query, function(err, graph){
        if(graph.some(store.rdf.filters.p(store.rdf.resolve('foaf:name')))) {
            nameTriples = graph.match(null,
                                        store.rdf.createNamedNode(rdf.resolve('foaf:name')),
                                        null);
        
            nameTriples.forEach(function(triple) {
                console.log(triple.object.valueOf());
            });
        }
    });

    var query = 'PREFIX foaf:<http://xmlns.com/foaf/0.1/> SELECT ?o \
        FROM NAMED <lisp> { GRAPH <lisp> { ?s foaf:page ?o} }';
    store.execute(query, function(err, results) {
        console.log("item", results);
    });


    

}); */