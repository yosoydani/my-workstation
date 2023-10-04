-- Definir el carácter líder para los mapeos
vim.g.mapleader = ' '
vim.g.maplocalleader = ' '

-- Mapeos para gestionar divisiones
vim.opt.splitbelow = true
vim.opt.splitright = true
vim.api.nvim_set_keymap('n', '<C-J>', '<C-W><C-J>', { noremap = true })
vim.api.nvim_set_keymap('n', '<C-K>', '<C-W><C-K>', { noremap = true })
vim.api.nvim_set_keymap('n', '<C-H>', '<C-W><C-H>', { noremap = true })
vim.api.nvim_set_keymap('n', '<C-L>', '<C-W><C-L>', { noremap = true })

-- Abrir el archivo de configuraciónn rapidamente
vim.api.nvim_set_keymap('n', '<Leader>ev', ':tabedit $MYVIMRC<CR>', { noremap = true })

-- Borrar busqueda
vim.api.nvim_set_keymap('n', '<Leader><Space>', ':nohlsearch<CR>', { noremap = true })

-- Volver al modo normal con jj 
vim.api.nvim_set_keymap('i', 'jj', '<Esc>', { noremap = true })

-- Añadir un espacio al crear una linea nueva 
-- vim.api.nvim_set_keymap('n', 'oo', 'o<Enter>', { noremap = true })

-- Si el texto sobrepasa la pantalla contar por filas no por lineas, excepto si se provee un contador
vim.keymap.set('n', 'k', "v:count == 0 ? 'gk' : 'k'", { expr = true })
vim.keymap.set('n', 'j', "v:count == 0 ? 'gj' : 'j'", { expr = true })

-- Mantener seleccón al identar en modo visual
vim.keymap.set('v', '<', '<gv')
vim.keymap.set('v', '>', '>gv')

-- Mantener el cursos en la misma posición cuando ankeamos en modo visual
-- http://ddrscott.github.io/blog/2016/yank-without-jank/
vim.keymap.set('v', 'y', 'myy`y')
vim.keymap.set('v', 'Y', 'myY`y')

-- Pega en modo visual sin copiar lo que se ha borrado
vim.keymap.set('v', 'p', '"_dP')

-- insertar ; o , al final de la linea facilmente desde modo insertar
vim.keymap.set('i', ';;', '<Esc>A;<Esc>')
vim.keymap.set('i', ',,', '<Esc>A,<Esc>')

-- Abre el archivo actual en el programa predeterminado
vim.keymap.set('n', '<leader>x', ':!xdg-open %<cr><cr>')

-- Move text up and down
vim.keymap.set('i', '<A-j>', '<Esc>:move .+1<CR>==gi')
vim.keymap.set('i', '<A-k>', '<Esc>:move .-2<CR>==gi')
vim.keymap.set('n', '<A-j>', ':move .+1<CR>==')
vim.keymap.set('n', '<A-k>', ':move .-2<CR>==')
vim.keymap.set('v', '<A-j>', ":move '>+1<CR>gv=gv")
vim.keymap.set('v', '<A-k>', ":move '<-2<CR>gv=gv")

