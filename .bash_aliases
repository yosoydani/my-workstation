alias composer='docker run --interactive --tty --volume $PWD:/app --user $(id -u):$(id -g) composer'
alias php='docker run -it --rm --name my-running-script -v "$PWD":/usr/src/myapp -w /usr/src/myapp local-php php'
alias dc='docker-compose'
