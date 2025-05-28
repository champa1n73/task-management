pipeline {
    agent any
    environment {
        FRONTEND_VERCEL_HOOK_URL = 'https://api.vercel.com/v1/integrations/deploy/prj_gAdZWm3ucSLoMnUK3vbt2QyNA6GH/Ty8v3ngsfV'
        BACKEND_VERCEL_HOOK_URL = 'https://api.vercel.com/v1/integrations/deploy/prj_PlOH7HJRyM1P0TPNATSdUnmPY8An/sV5OJLs8rB'
    }
    stages {
        stage('Git Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/champa1n73/task-management.git'
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    bat "npm install"
                    bat "npm run build"
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
