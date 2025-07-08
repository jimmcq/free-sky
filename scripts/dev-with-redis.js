#!/usr/bin/env node

const { spawn } = require('child_process')
const { Redis } = require('ioredis')
const net = require('net')

let redisProcess = null
let nextProcess = null

// Check if Redis is already running using a simple socket test
async function checkRedis() {
  return new Promise((resolve) => {
    const socket = new net.Socket()
    
    const timeout = setTimeout(() => {
      socket.destroy()
      resolve(false)
    }, 500) // 500ms timeout
    
    socket.setTimeout(500)
    
    socket.on('connect', () => {
      clearTimeout(timeout)
      socket.destroy()
      resolve(true)
    })
    
    socket.on('timeout', () => {
      clearTimeout(timeout)
      socket.destroy()
      resolve(false)
    })
    
    socket.on('error', () => {
      clearTimeout(timeout)
      socket.destroy()
      resolve(false)
    })
    
    socket.connect(6379, 'localhost')
  })
}

// Start Redis server
function startRedis() {
  console.log('🔴 Starting Redis server...')
  redisProcess = spawn('redis-server', ['--port', '6379'], {
    stdio: ['ignore', 'pipe', 'pipe']
  })

  redisProcess.stdout.on('data', (data) => {
    const output = data.toString()
    if (output.includes('Ready to accept connections')) {
      console.log('✅ Redis server is ready')
      startNext()
    }
  })

  redisProcess.stderr.on('data', (data) => {
    console.error('Redis error:', data.toString())
  })

  redisProcess.on('close', (code) => {
    console.log(`Redis process exited with code ${code}`)
  })
}

// Start Next.js development server
function startNext() {
  console.log('🔵 Starting Next.js development server...')
  
  // Set Redis environment variable
  process.env.REDIS_HOST = 'localhost'
  
  nextProcess = spawn('yarn', ['dev'], {
    stdio: 'inherit',
    env: { ...process.env, REDIS_HOST: 'localhost' }
  })

  nextProcess.on('close', (code) => {
    console.log(`Next.js process exited with code ${code}`)
    cleanup()
  })
}

// Cleanup function
function cleanup() {
  console.log('\n🧹 Cleaning up...')
  
  if (nextProcess) {
    nextProcess.kill('SIGTERM')
  }
  
  if (redisProcess) {
    redisProcess.kill('SIGTERM')
  }
  
  process.exit(0)
}

// Handle process termination
process.on('SIGINT', cleanup)
process.on('SIGTERM', cleanup)

// Main execution
async function main() {
  console.log('🚀 Starting development environment with Redis...')
  
  const redisRunning = await checkRedis()
  
  if (redisRunning) {
    console.log('✅ Redis is already running')
    startNext()
  } else {
    console.log('🔴 Redis not detected, starting Redis server...')
    startRedis()
  }
}

main().catch(console.error)