pipeline {
    agent any
    environment {
        DOCKER_IMAGE = "poojadissanayake/complete-pipeline:${env.BUILD_ID}"
        MONGO_CREDENTIALS = credentials('mongo-connection')
    }
    stages {
        stage('Build'){
            steps{
                script {
                    echo 'Building Docker image...'
                    // Build the Docker image
                    sh 'docker build -t ${DOCKER_IMAGE} .'
                }
            }
        }
        stage('Test'){
            steps{
                script {
                    echo 'Running tests...'
                    // Run the tests inside the Docker container
                    sh "docker run --rm ${DOCKER_IMAGE} npm test"
                }
            }
            post {
                success {
                    echo 'Testing Success.'
                    mail to: 'poojadissanayake6@gmail.com',
                        subject: "Testing Success",
                        body: "Testing stage completed successfully.\n\n" +
                            "Check the build logs at ${env.BUILD_URL}"
                }
                failure {
                    echo 'Testing failed.'
                    mail to: 'poojadissanayake6@gmail.com',
                        subject: "Testing failed",
                        body: "Testing failed.\n\n" +
                            "Check the build logs at ${env.BUILD_URL}"
                }
            }
        }
        stage('Code Analysis') {
            steps {
                echo "Integrate a code analysis tool to analyse the code and ensure it meets industry standards."
                echo "Tool: SonarQube"
            }
        }
        stage('Security Scan'){
            steps{
                echo "Perform a security scan on the code using a tool to identify any vulnerabilities."
                echo "Tool: Burp Suit"
            }
            post {
                success {
                    echo 'Security Scan Success.'
                    mail to: 'poojadissanayake6@gmail.com',
                        subject: "Security Scan Success",
                        body: "Security Scan stage completed successfully.\n\n" +
                            "Check the build logs at ${env.BUILD_URL}"
                }
                failure {
                    echo 'Security Scan failed.'
                    mail to: 'poojadissanayake6@gmail.com',
                        subject: "Security Scan failed",
                        body: "Security Scan failed.\n\n" +
                            "Check the build logs at ${env.BUILD_URL}"
                }
            }
        }
        stage('Deploy to Staging'){
            steps{
                echo "Deploy the application to a staging server"
                echo "Tool: AWS Cloudformation"
            }
        }
        stage('Integration Tests on Staging'){
            steps{
                echo "Run integration tests on the staging environment to ensure the application functions as expected in a production-like environment"
                echo "Tool: Selenium"
            }
        }
        stage('Deploy to Production'){
            steps{
                echo "Deploy the application to a production server"
                echo "Tool: AWS Cloudformation"
            }
        }
    }
}