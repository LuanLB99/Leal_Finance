pipeline {
    agent any
    environment {
        DB_CONTAINER = "db-test-${BUILD_NUMBER}"
    }
    stages {
        stage('Setup Environment') {
            steps {
                // Remove se já existir (limpeza)
                sh "docker rm -f ${DB_CONTAINER} || true"

                // Sobe o banco na rede do PRÓPRIO JENKINS
                // O Jenkins geralmente está na rede 'bridge' ou na rede do docker-compose
                sh "docker run -d --name ${DB_CONTAINER} --network leal_finance_default -e POSTGRES_PASSWORD=minhasenha -e POSTGRES_DB=financas_db postgres:15"
            }
        }

        stage('Build & Test') {
            steps {
                // Agora o Jenkins roda o Maven nativamente.
                // Ele vai achar o banco pelo nome do container na rede leal_finance_default
                sh "chmod +x mvnw"
                sh "./mvnw clean test -Dspring.profiles.active=test -Dspring.datasource.url=jdbc:postgresql://${DB_CONTAINER}:5432/financas_db"
            }
        }
    }
    post {
        always {
            sh "docker rm -f ${DB_CONTAINER} || true"
        }
    }
}