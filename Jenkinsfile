pipeline {
    agent any
    environment {
        FRONTEND_VERCEL_HOOK_URL = 'https://api.vercel.com/v1/integrations/deploy/prj_gAdZWm3ucSLoMnUK3vbt2QyNA6GH/Ty8v3ngsfV'
        BACKEND_VERCEL_HOOK_URL = 'https://api.vercel.com/v1/integrations/deploy/prj_jVTFZiG8TaUDhWaA7sVzTVzO6Ypr/p11WJfsjJG'
    }
    stages {
        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }   

        stage('Git Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/champa1n73/task-management.git'
            }
        }

        stage('Build Frontend & Test') {
            steps {
                dir('frontend') {
                    bat "npm install"
                    bat "npm run build"
                    bat "npm test"
                }
            }
        }

        stage('Install & Test Backend') {
            steps {
                dir('server') {
                    bat "npm install"  // should install dev dependencies including supertest
                    bat "npm test"
                }
            }
        }

        stage('Deploy to Vercel') {
            steps {
                bat "curl -X POST %FRONTEND_VERCEL_HOOK_URL%"
                bat "curl -X POST %BACKEND_VERCEL_HOOK_URL%"
            }
        }
    }
}
