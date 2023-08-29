syntax enable

colorscheme desert

let mapleader = ','						"comma as leader
set number							"Line numbers
set linespace=15     

"------------Search----------------"
set hlsearch
set incsearch

"-------------Mappings-------------"
"Make it esasy to edit the init.vim file
nmap <Leader>ev :tabedit $MYVIMRC <cr>
"Simple highlight removal"
nmap <Leader><space> :nohlsearch<cr>


"-------------Auto-Commands-------------"
augroup autosourcing
	autocmd!
	autocmd bufwritePost $MYVIMRC source %
augroup END
			
