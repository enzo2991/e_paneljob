lib.callback.register(GetCurrentResourceName()..":getDashboardData",function(source)
    local data = {money = 0,inJob = 0, minuteInJob = 0, account = "LBX....",dataBank = {}}
    if Framework == 'esx' then
        local xPlayer = ESX.GetPlayerFromId(source)
        if xPlayer then
            local jobName = xPlayer.job.name
            -- moneySociety
            TriggerEvent('esx_addonaccount:getSharedAccount', 'society_'..jobName, function(account)
                data.money = account.money
            end)
            --Number player in Society
            local tableInUser = MySQL.query.await('SELECT COUNT(*) FROM users WHERE job = ?',{jobName})
            local tableInMultiJob = MySQL.query.await('SELECT COUNT(*) FROM wasabi_multijob WHERE job = ?',{jobName})
            local countInUser = tableInUser[1]["COUNT(*)"]
            local countInMultiJob = tableInMultiJob[1]["COUNT(*)"]
            data.inJob = countInUser + countInMultiJob
            -- get iban
            local accountBanking = MySQL.single.await('SELECT `iban` FROM s1n_bank_accounts WHERE name = ? LIMIT 1',{'society_'..jobName})
            if accountBanking then
                data.account = accountBanking.iban
                -- get data for bank stash
                local accountDataBank = MySQL.query.await('SELECT `action`, `label`, `amount`, `date` FROM s1n_bank_statements WHERE `iban` = ? ORDER BY date DESC',{data.account})
                data.dataBank = accountDataBank
            end
            -- get number minuteInJob
        end
    elseif Framework == 'qb' then
    else
        -- Custom framework
    end
    return data
end)

lib.callback.register(GetCurrentResourceName()..":getFactureData",function(source)
    local data = {billings={}}
    if Framework == 'esx' then
        local xPlayer = ESX.GetPlayerFromId(source)
        if xPlayer then
            local jobName = xPlayer.job.name
            data.billings = MySQL.query.await('SELECT `timestamp`,`recipient_label`,`status`,`amount`,`summary` FROM vivum_invoices WHERE `sender` = ? ORDER BY timestamp DESC',{jobName})
        end
    elseif Framework == 'qb' then
    else
        -- Custom framework
    end
    return data
end)

lib.callback.register(GetCurrentResourceName()..":getPermsData",function(source,group)
    local data = Config.perms
    if Framework == 'esx' then
        local xPlayer = ESX.GetPlayerFromId(source)
        if xPlayer then
            local jobName = xPlayer.job.name
            local gradeperms = MySQL.single.await('SELECT `ui_permissions` FROM job_grades WHERE job_name = ? && name = ? LIMIT 1',{jobName, group})
            local perms = json.decode(gradeperms.ui_permissions)
            for k,i in pairs(data) do
                local value = false
                if next(perms) then
                    for _,l in ipairs(perms) do
                        if i.key == l then
                            value = true
                        end
                    end
                end
                data[k].state = value
            end
        end
    elseif Framework == 'qb' then
    else
        -- Custom framework
    end
    return data
end)

lib.callback.register(GetCurrentResourceName()..":getAllGrades",function(source)
    local data = {}
    if Framework == 'esx' then
        local xPlayer = ESX.GetPlayerFromId(source)
        if xPlayer then
            local jobName = xPlayer.job.name
            data = MySQL.query.await('SELECT `grade`,`name`,`label`,`salary` FROM job_grades WHERE `job_name` = ? ORDER BY grade ASC',{jobName})
        end
    elseif Framework == 'qb' then
    else
        -- Custom framework
    end
    return data
end)

lib.callback.register(GetCurrentResourceName()..":getPersonnel",function(source)
    local data = {}
    if Framework == 'esx' then
        local xPlayer = ESX.GetPlayerFromId(source)
        if xPlayer then
            local jobName = xPlayer.job.name
            local requests = MySQL.query.await('SELECT u.identifier, u.firstname, u.lastname, u.job_grade FROM users u WHERE u.job = ? UNION SELECT u.identifier, u.firstname, u.lastname, wm.grade FROM wasabi_multijob wm JOIN users u on wm.identifier = u.identifier WHERE wm.job = ?',{jobName,jobName})
            for k,v in pairs(requests) do
                local numberGrade = "0"
                if v.grade then
                    numberGrade = tostring(v.grade)
                    requests[k].grade = nil
                else
                    numberGrade = tostring(v.job_grade)
                    requests[k].job_grade = nil
                end
                requests[k].grade = {name = ESX.Jobs[jobName].grades[numberGrade].name, number = tonumber(numberGrade)}
            end
            data = requests
        end
    elseif Framework == 'qb' then
    else
        -- Custom framework
    end
    return data
end)

RegisterNetEvent(GetCurrentResourceName()..":setperms",function (action,permissionSelect,gradeSelect)
    local source = source
    if Framework == 'esx' then
        local xPlayer = ESX.GetPlayerFromId(source)
        if xPlayer then
            local jobName = xPlayer.job.name
            local getPermsInDB = MySQL.single.await('SELECT `ui_permissions` FROM job_grades WHERE job_name = ? AND grade = ?',{jobName,gradeSelect})
            local Perms = json.decode(getPermsInDB.ui_permissions)
            if action == "active" then
                Perms[#Perms+1] = permissionSelect
            elseif action == "inactive" then
                for k,v in pairs(Perms) do
                    if v == permissionSelect then
                        table.remove(Perms,k)
                        break
                    end
                end
            end
            local affectedRow = MySQL.update.await('UPDATE job_grades SET ui_permissions = ? WHERE job_name = ? AND grade = ?',{json.encode(Perms),jobName,gradeSelect})
            if affectedRow > 0 then
                for _,sPlayer in pairs(ESX.GetExtendedPlayers()) do
                    if sPlayer.job.name == jobName and sPlayer.job.grade == gradeSelect then
                        TriggerClientEvent(GetCurrentResourceName()..":setPermissions",sPlayer.source,json.encode(Perms))
                    end
                end
                xPlayer.showNotification("Mise a jour des permissions")
            end
        end
    elseif Framework == 'qb' then
    else
        -- Custom framework
    end
end)

RegisterNetEvent(GetCurrentResourceName()..":setgrade",function (action,gradeSelect,data)
    local _source = source
    local xPlayer = ESX.GetPlayerFromId(_source)
    if xPlayer then
        local jobName = xPlayer.job.name
        if action == "create" then
            MySQL.query('SELECT grade from `job_grades` WHERE job_name = ?',{jobName}, function (result)
                local countGrade = #result
                MySQL.update('UPDATE job_grades SET grade = ? WHERE name = "boss" AND job_name = ?',{countGrade, jobName},function(affectedRows)
                    if affectedRows > 0 then
                        MySQL.insert('INSERT INTO `job_grades` (job_name, grade, name, label, salary, skin_male, skin_female, ui_permissions) VALUES (?, ?, ?, ?, ?, "{}", "{}", "[]")',{jobName, countGrade-1, data.name, data.label, data.salary}, function(id)
                            if id then
                                ESX.RefreshJobs()
                                TriggerClientEvent(GetCurrentResourceName()..":updateGrade",xPlayer.source)
                            end
                        end)
                    end
                end)
            end)
        elseif action == "update" then
            MySQL.update('UPDATE job_grades SET name = ?, label = ?, salary = ? WHERE job_name = ? AND grade = ? ',{data.name, data.label, data.salary, jobName, gradeSelect},function(affectedRows)
                if affectedRows > 0 then
                    ESX.RefreshJobs()
                    TriggerClientEvent(GetCurrentResourceName()..":updateGrade",xPlayer.source)
                end
            end)
        elseif action == "delete" then
            MySQL.execute("DELETE FROM job_grades WHERE job_name = ? AND grade = ?",{jobName,gradeSelect},function(table)
                if table then
                    MySQL.update("UPDATE job_grades set grade = grade - 1 WHERE job_name = ? AND grade > ?",{jobName,gradeSelect},function(updateTable)
                        if updateTable then
                            ESX.RefreshJobs()
                            TriggerClientEvent(GetCurrentResourceName()..":updateGrade",xPlayer.source)
                        end
                    end)
                end
            end)
        end
    end
end)

local function getAllsPerms()
    local data = {}
    for k,v in pairs(Config.perms) do
        data[#data+1] = v.key
    end
    return data
end

exports("getAllsPerms",getAllsPerms)

if Framework == 'esx' then
    ESX.RegisterCommand('createjob', 'admin', function(xPlayer, args, showError)
        if not ESX.DoesJobExist(args.name,0) then
            local allperms = json.encode(getAllsPerms())
            local allgrades = {{grade = 0,name = "employer", label = "Employé",salary = 0},{grade = 1,name = "boss", label = "Patron",salary = 0, ui_permissions = allperms}}
            ESX.CreateJob(args.name,args.label,allgrades)
            xPlayer.showNotification(TranslateCap('command_createjob_success'), true, false, 140)
        else
            xPlayer.showNotification(TranslateCap('command_createjob_failed'), true, false, 140)
        end
        if Config.AdminLogging then
            ESX.DiscordLogFields("UserActions", "createJob /createjob Triggered!", "pink", {
                { name = "Player", value = xPlayer and xPlayer.name or "Server Console", inline = true },
                { name = "ID",     value = xPlayer and xPlayer.source or "Unknown ID",   inline = true },
                { name = "name", value = args.name,                                  inline = true },
                { name = "label",   value = args.label,                                    inline = true },
            })
        end
    end, true, {
        help = TranslateCap('command_createjob'),
        validate = true,
        arguments = {
            { name = 'name', help = TranslateCap('commandgeneric_string'), type = 'string' },
            { name = 'label',   help = TranslateCap('commandgeneric_string'), type = 'string' },
        }
    })
elseif Framework == 'qb' then
else
    -- Custom frameworks
end