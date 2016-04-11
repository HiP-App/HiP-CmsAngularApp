module.exports = function(plugins) {
  var errorsCount = 0;

  return {
    /*
     * Error handler for gulp exceptions.
    */
    onError: function( error ) {
      plugins.nodeNotifier.notify({
        'title': 'Error',
        'message': 'Check Console'
      });

      errorsCount++;
      plugins.util.log(error);
      this.emit('end');
    },


    /*
     * Function to check for errors after a task was completed.
    */
    onTaskComplete: function( taskName ) {
      if( errorsCount > 0 ) {
        plugins.util.log(plugins.util.colors.bgRed('Task "' + taskName + '" terminated because of error(s)'));
        process.exit(1);
      }
      else 
        plugins.util.log(plugins.util.colors.bgGreen('Task "' + taskName + '" completed successfully'));
    }
  }
};