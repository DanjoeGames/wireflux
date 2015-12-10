// Reduces a collection with asynchronous reduce functions.
module.exports = function reduceAsync(list, reducer, init, done) {

  function innerReduce(list, acc) {
    if(list.length === 0) return done(acc);

    var head = coll[0];
    var tail = coll.slice(1);

    reducer(acc, head, function next(acc) {
      innerReduce(tail, acc);
    });
  }

  innerReduce(list, init);
};

