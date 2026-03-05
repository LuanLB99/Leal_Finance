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
                    sh "chmod +x mvnw"
                    // Aqui forçamos o Spring a usar o banco que o DOCKER acabou de subir
                    // Mesmo que no arquivo properties esteja configurado outra coisa, o comando abaixo SOBRESCREVE
                    sh """
                    ./mvnw clean test \
                    -Dspring.profiles.active=test \
                    -Dspring.datasource.url=jdbc:postgresql://${DB_CONTAINER}:5432/financas_db \
                    -Dspring.datasource.username=postgres \
                    -Dspring.datasource.password=minhasenha \
                    -Dfile.encoding=UTF-8
                    """
                }
        }
    }
    post {
        always {
            sh "docker rm -f ${DB_CONTAINER} || true"
        }
    }
}