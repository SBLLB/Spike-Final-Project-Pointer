Pointer = new Mongo.Collection('Pointer')

Pointer.elementon = function() {
  var x = Pointer.find().fetch()[0].x
  var y = Pointer.find().fetch()[0].y
  return document.elementFromPoint(x-2, y-2)
}

if (Meteor.isClient) {
  Session.set('taps', 0)

  var id = new Mongo.ObjectID
  Pointer.insert({_id: id, x: 50, y: 50, el: null})
  // counter starts at 0
  Template.pointer.rendered = function() {
    
  }
  Template.pointer.helpers({
    x: function(){
      var x = _.first(Pointer.find({}).fetch()).x
      if(x === undefined)
        x = 0;
      return x
    },

    y: function(){
      var y = _.first(Pointer.find({}).fetch()).y
      if(y === undefined)
        y = 0;
      return y
    },

  })

  Template.button.rendered = function() {
    var button = this.find('button')
    var pointer = $('nav')

    Hammer(button).on('tap', function(e){
      Session.set('taps', (Session.get('taps') + 1))
      console.log(Session.get('taps'))
      switch(Session.get('taps')){
        case 1:
          startMovementCapture()
          break;
        case 2:
          pointer.hide()
          Session.set('movingpostit', Pointer.elementon().id);
          break;
      }

    })
  }

  Tracker.autorun(function() {
    var pointer = _.first(Pointer.find(id).fetch())
    if (Session.get('taps') === 2)
      var movingpostitId = Session.get('movingpostit')
      console.log(movingpostitId)
      $('#'+ movingpostitId ).css('left', pointer.x +'px')
      // console.log(Session.get('movingpostit'))
      // console.log(pointer.x)
  });

  // function moveElement(el){
    

  //   // console.log("GOT YA!")
  //   // console.log(el)
  // }

  function writeCoordinance(m){
    var x = (m.gamma*15).toPrecision(3) 
    var y = (m.beta*15).toPrecision(3)
    Pointer.update(id,{$set:{x: x, y: y}})
  }

  function startMovementCapture(){
    window.addEventListener('deviceorientation', writeCoordinance, false)
  }

  function stopMovementCapture(){
    window.removeEventListener('deviceorientation', writeCoordinance, false)
  }

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
