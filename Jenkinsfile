pipeline {
  agent any

  stages {
    stage('Prepare') {
      steps {
        dir('/workspace/pocket-balance') {
          sh 'ls'
        }
      }
    }

    stage('Install') {
      steps {
        dir('/workspace/pocket-balance') {
          sh 'npm ci'
        }
      }
    }

    stage('Lint') {
      steps {
        dir('/workspace/pocket-balance') {
          sh 'npm run lint'
        }
      }
    }

    stage('Unit Tests') {
      steps {
        dir('/workspace/pocket-balance') {
          sh 'npm run test:unit -- --runInBand'
        }
      }
    }

    stage('Build') {
      steps {
        dir('/workspace/pocket-balance') {
          sh 'npm run build:web'
        }
      }
    }
  }
}