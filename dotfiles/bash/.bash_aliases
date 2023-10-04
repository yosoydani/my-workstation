alias phpunit=' ./vendor/phpunit/phpunit/phpunit' 
alias sail='[ -f sail ] && bash sail || bash vendor/bin/sail'
alias ..='cd ..'
alias cdhome='cd ~'
alias cdcode='cd ~/code'
alias cdetc='cd /etc'
alias cdvar='cd /var'
# composer y php para no tener que instalarlos en el equipo
# alias composer='docker run --interactive --tty --volume $PWD:/app --user $(id -u):$(id -g) composer'
#alias php='docker run -it --rm --name my-running-script -v "$PWD":/usr/src/myapp -w /usr/src/myapp local-php php'
# alias dc='docker-compose'


neofetch
