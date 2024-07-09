local openUI = false


local function openEntreprise()
    openUI = not openUI
    if openUI then
        local playerJob, playerGrade,playerPermissions = nil, nil, nil
        if Framework == 'esx' then
            playerJob = ESX.PlayerData.job.label
            playerGrade = ESX.PlayerData.job.grade_label
            playerPermissions = ESX.PlayerData.job.grade_permissions
        elseif Framework == 'qb' then
        else
            -- custom value
        end
        SendNUIMessage({
            action = 'openUi',
            data = {
                job = playerJob,
                grade = playerGrade,
                permissions = playerPermissions
            }
        })
        SetNuiFocus(true,true)
    end
end
if Config.Debug then
    RegisterCommand("openEntreprise",function ()
        openEntreprise()
    end,false)
end

-- Nui Callback

RegisterNUICallback("getFactureData",function (_,cb)
    local value = lib.callback.await(GetCurrentResourceName()..":getFactureData")
    cb(value)
end)

RegisterNUICallback("getAllGrades",function (_,cb)
    local value = lib.callback.await(GetCurrentResourceName()..":getAllGrades")
    cb(value)
end)

RegisterNUICallback("getPermsData",function (data,cb)
    local value = lib.callback.await(GetCurrentResourceName()..":getPermsData",false,data.jobName)
    cb(value)
end)

RegisterNUICallback("getDashboardData",function (_,cb)
    local value = lib.callback.await(GetCurrentResourceName()..":getDashboardData")
    cb(value)
end)

RegisterNUICallback("getPersonnel",function (_,cb)
    local value = lib.callback.await(GetCurrentResourceName()..":getPersonnel")
    cb(value)
end)

RegisterNUICallback("closeUI",function(_,cb)
    openUI = false
    SetNuiFocus(false,false)
    cb(false)
end)


-- Button

RegisterNUICallback("setPerms",function(data,cb)
    if data.action then
        TriggerServerEvent(GetCurrentResourceName()..":setperms",data.action,data.permissionSelect,data.gradeSelect)
    end
    cb(false)
end)

-- grade

RegisterNetEvent(GetCurrentResourceName()..":updateGrade",function()
    SendNUIMessage({
        action = "updateGrade",
    })
end)

RegisterNUICallback("setgrade",function(data,cb)
    if data.action then
        local receiveData = {name = data.gradeName,label = data.gradeLabel,salary = data.gradeSalary}
        TriggerServerEvent(GetCurrentResourceName()..":setgrade",data.action,data.gradeSelect,receiveData)
    end
    cb(false)
end)

RegisterNUICallback("buttonAction",function(data,cb)
    if data.action == "promote" then
    elseif data.action == "update" then
    end
    cb(false)
end)

-- target
local function interact(entity, distance, coords)
    if Framework == 'esx' then
        return ESX.PlayerData.job.name ~= "unemployed"
    elseif Framework == 'qb' then
    else
        --custom framework
        
    end
end

exports.ox_target:addModel("prop_laptop_01a",{
    label = "💼 Gestion entreprise",
    name = "openEntreprise",
    distance = 2.0,
    canInteract = interact,
    onSelect = function(data)
        openEntreprise()
    end
})