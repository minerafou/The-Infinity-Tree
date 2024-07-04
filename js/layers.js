addLayer("d", {
    name: "digit", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "D", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#4BDC13",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "digits", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('d', 13)) mult = mult.times(upgradeEffect('d', 13))
        if (hasUpgrade('d', 22)) mult = mult.times(upgradeEffect('d', 22))
        if (hasMilestone('c', 2)) mult = mult.times(10)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    passiveGeneration() {
        if (hasMilestone("c", 3)) return 0.1
    },

    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},

    upgrades: {
        11: {
            title: "Digits",
            description: "Double your point gain.",
            cost: new Decimal(1),
        },
        12: {
            title: "Numbers",
            description: "Boost point gain based on digits.",
            cost: new Decimal(2),
            effect() {
                return player[this.layer].points.add(1).pow(0.5)
            },
            effectDisplay() {return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        13: {
            title: "Hundreds",
            description: "Point reduce digits cost.",
            cost: new Decimal(5),
            effect() {
                return player.points.add(1).pow(0.15)
            },
            effectDisplay() {return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        14: {
            title: "Thousands",
            description: "Double your point gain.",
            cost: new Decimal(7),
        },
        21: {
            title: "12345",
            description: "Point gain boost point gain",
            cost: new Decimal(500),
            effect() {
                return player.points.add(1).pow(0.2)
            },
            effectDisplay() {return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        22: {
            title: "Almost millions",
            description: "Digits boost digits gain",
            cost: new Decimal(3000000),
            effect() {
                return player[this.layer].points.add(1).pow(0.1)
            },
            effectDisplay() {return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        23: {
            title: "Life goal",
            description: "Square calculation effect",
            cost: new Decimal(12000000),
        },
    },
})

addLayer("c", {
    name: "Calculation", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
    branches: ["d"],
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#24F8A2",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "calculation", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 2, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        mult = mult.times(10)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},

    effect() {
        eff = new Decimal(1)
        eff = eff.times(player[this.layer].points.add(1))
        if (hasUpgrade("d", 23)) eff = eff.times(eff)
        return eff
    },
    effectDescription() {return "witch boost point gain by " + this.effect() + "x"}, // Add formatting to the effect

    milestones: {
        0: {
            requirementDescription: "Increment (1 calculation)",
            effectDescription: "Point gain x3",
            done() { return player[this.layer].points.gte(1) }
        },
        1: {
            requirementDescription: "Addition (3 calculation)",
            effectDescription: "Point gain x5",
            done() { return player[this.layer].points.gte(3) }
        },
        2: {
            requirementDescription: "Multiplication (5 calculation)",
            effectDescription: "Digits gain x10",
            done() { return player[this.layer].points.gte(5) }
        },
        3: {
            requirementDescription: "Power (7 calculation)",
            effectDescription: "Gain 10% of digits per second",
            done() { return player[this.layer].points.gte(7) }
        },
    },
})
