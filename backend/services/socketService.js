const Poll = require('../models/Poll');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Join a poll session room
    socket.on('joinSession', async (sessionCode) => {
      try {
        const poll = await Poll.findOne({ 
          sessionCode: sessionCode.toUpperCase(),
          active: true 
        });

        if (poll) {
          socket.join(sessionCode);
          console.log(`Client ${socket.id} joined session: ${sessionCode}`);
          socket.emit('pollData', poll);
        } else {
          socket.emit('error', 'Invalid session code');
        }
      } catch (err) {
        console.error('Join session error:', err);
        socket.emit('error', 'Failed to join session');
      }
    });

    // Handle vote submission
    socket.on('submitVote', async ({ sessionCode, optionIndex }) => {
      try {
        const poll = await Poll.findOne({ 
          sessionCode: sessionCode.toUpperCase(),
          active: true 
        });

        if (!poll || optionIndex < 0 || optionIndex >= poll.options.length) {
          return socket.emit('error', 'Invalid vote data');
        }

        poll.options[optionIndex].votes += 1;
        const updatedPoll = await poll.save();
        
        io.to(sessionCode).emit('updateResults', {
          options: updatedPoll.options,
          totalVotes: updatedPoll.options.reduce((sum, opt) => sum + opt.votes, 0)
        });

      } catch (err) {
        console.error('Vote processing error:', err);
        socket.emit('error', 'Failed to process vote');
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};