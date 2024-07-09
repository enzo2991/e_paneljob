fx_version 'cerulean'
use_experimental_fxv2_oal 'yes'
lua54 'yes'
game 'gta5'
author 'Enzo'
version '1.0.0'

dependencies {'/onesync', 'oxmysql','ox_target'}

shared_scripts {'@ox_lib/init.lua','config.lua','locale.lua','locales/*.lua'}

server_scripts {'bridge/server.lua', '@oxmysql/lib/MySQL.lua', 'server.lua'}

client_scripts {'bridge/client.lua', 'client.lua'}

ui_page 'web/build/index.html'

files {'client.lua', 'server.lua', 'web/build/index.html', 'web/build/assets/*.js', 'web/build/assets/*.css'}
