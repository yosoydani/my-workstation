-- Establecer esquema de colores
vim.cmd('colorscheme desert')

-- Portapapeles aoutomático
vim.opt.clipboard = 'unnamedplus'



-- Preguntar confirmación en lugar de dar error
vim.opt.confirm = true

-- No perder deshacer
vim.opt.undofile = true


-- Configuración de apariencia
vim.opt.number = true
vim.opt.linespace = 15
vim.opt.expandtab = true
vim.opt.tabstop = 4
vim.opt.shiftwidth = 4
vim.opt.softtabstop = 4
vim.opt.smartindent = true
vim.opt.wildmode = 'longest:full,full'
vim.opt.title = true
vim.opt.mouse = 'a'
-- vim.opt.termguicolors = true
-- vim.opt.spell = true
vim.opt.scrolloff = 8
vim.opt.sidescrolloff = 8

-- Configuración de búsqueda
vim.opt.ignorecase = true
vim.opt.hlsearch = true
vim.opt.incsearch = true

-- Mapeos para gestionar divisiones
vim.opt.splitbelow = true
vim.opt.splitright = true
vim.api.nvim_set_keymap('n', '<C-J>', '<C-W><C-J>', { noremap = true })
vim.api.nvim_set_keymap('n', '<C-K>', '<C-W><C-K>', { noremap = true })
vim.api.nvim_set_keymap('n', '<C-H>', '<C-W><C-H>', { noremap = true })
vim.api.nvim_set_keymap('n', '<C-L>', '<C-W><C-L>', { noremap = true })

-- Mapeos personalizados
vim.api.nvim_set_keymap('n', '<Leader>ev', ':tabedit $MYVIMRC<CR>', { noremap = true })
vim.api.nvim_set_keymap('n', '<Leader><Space>', ':nohlsearch<CR>', { noremap = true })
vim.api.nvim_set_keymap('i', 'jj', '<Esc>', { noremap = true })

-- Auto-comandos

-- options.lua

local M = {}

M.setup = function()
    vim.cmd([[
        augroup autosourcing
            autocmd!
            autocmd bufwritePost $MYVIMRC source %
        augroup END
    ]])
end

return M

