pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build') {
      steps {
        dir('api') {
          sh 'npm install'
        }
      }
    }

    stage('Test') {
      steps {
        dir('api') {
          sh 'npm test'
        }
      }
    }
  }

  post {
    always {
      echo 'Pipeline terminé'
    }
  }
}