const express = require('express');
const cors = require('cors');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const prisma = new PrismaClient();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "musikku.privhandi.my.id",
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(passport.initialize());

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://musikku.privhandi.my.id/api/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await prisma.user.findUnique({
      where: { googleId: profile.id }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          avatar: profile.photos[0]?.value,
          username: profile.emails[0].value.split('@')[0]
        }
      });
    }

    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

// Routes
app.get('/api/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/api/auth/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const token = jwt.sign(
      { userId: req.user.id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.redirect(`http://musikku.privhandi.my.id/auth-success?token=${token}`);
  }
);

// Protected routes middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Playlist routes
app.post('/api/playlists', authenticate, async (req, res) => {
  try {
    const { title, description, isPublic, songs } = req.body;
    
    const playlist = await prisma.playlist.create({
      data: {
        title,
        description,
        isPublic,
        userId: req.userId,
        songs: {
          create: songs?.map(song => ({
            title: song.title,
            artist: song.artist,
            duration: song.duration,
            url: song.url,
            thumbnail: song.thumbnail
          }))
        }
      },
      include: {
        songs: true,
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    });

    res.status(201).json(playlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/playlists/public', async (req, res) => {
  try {
    const playlists = await prisma.playlist.findMany({
      where: { isPublic: true },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        songs: true,
        _count: {
          select: {
            likes: true,
            plays: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(playlists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/playlists/:id', async (req, res) => {
  try {
    const playlist = await prisma.playlist.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        songs: true,
        _count: {
          select: {
            likes: true,
            plays: true
          }
        }
      }
    });

    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    // Increment play count
    await prisma.playlist.update({
      where: { id: req.params.id },
      data: {
        plays: { increment: 1 }
      }
    });

    res.json(playlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Socket.io for real-time features
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-playlist', (playlistId) => {
    socket.join(`playlist-${playlistId}`);
  });

  socket.on('currently-playing', (data) => {
    socket.to(`playlist-${data.playlistId}`).emit('currently-playing', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
