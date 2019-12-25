const afloop = require("afloop")

const AXIS_NAMES = {
    "left-stick-x": 0,
    "left-stick-y": 1,
    "right-stick-x": 2,
    "right-stick-y": 3,
}

const BUTTON_NAMES = {
    "south-button": 0,
    "east-button": 1,
    "west-button": 2,
    "north-button": 3,
    "left-bumper": 4,
    "right-bumper": 5,
    "left-shoulder": 4,
    "right-shoulder": 5,
    "left-trigger": 6,
    "right-trigger": 7,
    "select-button": 8,
    "back-button": 8,
    "start-button": 9,
    "left-stick": 10,
    "right-stick": 11,
    "north-dbutton": 12,
    "south-dbutton": 13,
    "west-dbutton": 14,
    "east-dbutton": 15,
    "home-button": 16,
    "capture-button": 17,
    "screenshot-button": 17,
}

const Joyp = {
    "isPressed": function(gamepadIndex, buttonIndex) {
        if(BUTTON_NAMES[buttonIndex] != undefined) {
            buttonIndex = BUTTON_NAMES[buttonIndex]
        }
        const key = "gamepad" + gamepadIndex + "/" + "button" + buttonIndex
        if(this.data[key] != undefined) {
            return this.data[key].value > 0
        }
        return false
    },
    "wasJustPressed": function(gamepadIndex, buttonIndex, delta = 1000/60) {
        if(BUTTON_NAMES[buttonIndex] != undefined) {
            buttonIndex = BUTTON_NAMES[buttonIndex]
        }
        const key = "gamepad" + gamepadIndex + "/" + "button" + buttonIndex
        if(this.data[key] != undefined) {
            return this.data[key].value > 0
                && window.performance.now() - this.data[key].time < delta
        }
        return false
    },
    "getAxis": function(gamepadIndex, axisIndex) {
        if(AXIS_NAMES[axisIndex] != undefined) {
            axisIndex = AXIS_NAMES[axisIndex]
        }
        const key = "gamepad" + gamepadIndex + "/" + "axis" + axisIndex
        if(this.data[key] != undefined) {
            return this.data[key].value
        }
        return 0
    },
    "set": function(key, value) {
        this.data[key] = this.data[key] || {}
        if(this.data[key].value != value) {
            this.data[key].value = value
            this.data[key].time = window.performance.now()
        }
    },
    "get": function(key) {
        if(this.data[key] != undefined) {
            return this.data[key].value
        } else {
            return false
        }
    },
    "vibrate": function(gamepadIndex, options) {
        options = options || {
            "duration": 100,
            "weakMagnitude": 0.5,
            "strongMagnitude": 0.5,
        }
        const gamepad = this.references[gamepadIndex] || {}
        if(gamepad.vibrationActuator instanceof GamepadHapticActuator) {
            gamepad.vibrationActuator.playEffect("dual-rumble", options)
        }
    },
    "data": {},
    "references": {},
}

afloop(function() {
    const gamepads = navigator.getGamepads()

    for(let gamepadIndex = 0; gamepadIndex < gamepads.length; gamepadIndex += 1) {
        const gamepad = gamepads[gamepadIndex]
        if(gamepad != undefined) {
            gamepad.axes.forEach((axisValue, axisIndex) => {
                Joyp.set("gamepad" + gamepadIndex + "/" + "axis" + axisIndex, axisValue)
            })
            gamepad.buttons.forEach((button, buttonIndex) => {
                Joyp.set("gamepad" + gamepadIndex + "/" + "button" + buttonIndex, button.value)
            })

            Joyp.references["gamepad" + gamepadIndex] = gamepad
        }
    }
})

module.exports = Joyp
