const stairs = `
    return (func) => {
        return (args) => {
            return gates[func](...args)
        }
    }
`
const runes = [':-', '^-', '|=', '=/', '|-', '?:', '%=', '$', '%-', 
                '$%',  // union
                '+$',  // type
                '$:',  // cell creation
                '|%',  // core, with arms
                '|_'   // door, core with a sample and arms
              ]

const caseByCase = (rune) => `case '${rune}': ${stairs} break;`
const runeRunner = eval(`const appendage = (rune) => {switch(rune){${runes.reduce((initial, rune) => { return initial + caseByCase(rune)}, '')}}}; const returnFunc = () => appendage; returnFunc()`)

class EventProducer {
    cbs = {}
    
    on(listener, cb){
        this.cbs[listener] = cb
    }
    
    produce(listener, datum){
        this.cbs[listener](datum)
    }
}

class CompilerProducer extends EventProducer {
    hoon
    vars = {}
    varsGen = {}
    constructor() {
        super()
        this.functionName = this.functionName.bind(this);
        this.compile = this.compiler.bind(this);
        this.computable = this.computable.bind(this);
    }

    compiler(hoon, depth, verbose, args, varsCarry) {
        var vars = this.vars

        if(varsCarry) vars = varsCarry
        this.hoon = hoon
        
        try {
            const isRune = hoon.slice(0,2)

            if(runes.indexOf(isRune) != -1){
            
            }
                
            return this.computable(isRune, hoon)
        } catch(err){
            console.log(err)
        }
        
        return 0
    }
    
    functionName(args) {
            const pattern2Cells = /(.*)\[((.+)(?=\=)=(.+))+\s(.*)=(.*)\](.*)/; // (?<rune>\S+)\s{2}\[((?<var>.*?)(?=\=)(.*)]*)\]
            const match1 = this.hoon.match(pattern2Cells)
            const isRune = match1[7].trim().slice(0,2)
            args.map((arg,i) => {
                this.vars[this.varsGen[i][0]]=arg
            })
            this.computable(isRune, match1[7].trim(), 0)
            return  this
    }
    
    computable(isRune, hoon, depth){
        const pattern = /(?<rune>\S+)\s{2}(?<rest>.+)[==]*/gm;
        const match = hoon.match(pattern)
        
        switch(isRune){
            case runes[12]:
                const corePattern = /\+\$(\s*)(?<simpleType>(.+)=(.+))|((\s{2})(?<type>.+)(\s+)\$\:(\s*(?<members>(.+)=(.+)))+|\+\$\s{2}(.+)\s*((\$\%)\s{2}(?<unions>.+)))|(\s{2}(?<unionSet>.+)\s{2}\?\((?<union>.+)\))/gm
                const matched = [...hoon.matchAll(corePattern)]
                const core = {}
                const types = {}
                const simpleTypes = matched.filter(match => match.groups.simpleType != undefined)
                simpleTypes.forEach(st => types[st[3]] = st[4])
                // convert to lists
                const typesValues = Object.entries(types)
                
                typesValues.forEach(([k,v]) => {
                    if(v.includes('(list')){
                        types[k] = {}
                        const listPattern = /\(list (.+)\)/g
                        const listMatch = [...v.matchAll(listPattern)]
                        types[k]['list']  = listMatch[0][1]   
                    }
                })
                // console.log(typesValues)
                const unionTypes = matched.filter(match => match.groups.union != undefined)
                
                unionTypes.forEach(ut => {
                    types[ut[18]] = ut[19].split(' ')
                })
                const unionsTypes = matched.filter(match => match.groups.unions != undefined)
                unionsTypes.forEach(ut => {
                    // types[ut[13]] = {} 
                    types[ut[13]] =ut[16].replaceAll('[', '').replaceAll(']', '').split(' ')[1].replace('=', '') 
                })
                
                const typeTypes = matched.filter(match => match.groups.type != undefined)
                typeTypes.forEach((tt) => {
                    types[tt.groups.type.trim()] = {}
                    const listPattern = /\(list (.+)\)/g
                    const listMatch = [...tt.groups.members.matchAll(listPattern)]
                    if(listMatch.length > 0) types[tt.groups.type.trim()][tt.groups.members.split('=')[0]]  = {'list': listMatch[0][1]}
                })
                
                const membersParse = (hoon, member) => {
                    const corePattern = /\+\$(\s*)(?<simpleType>(.+)=(.+))|((\s{2})(?<type>.+)(\s+)\$\:(\s*(?<members>(.+)=(.+)))+|\+\$\s{2}(.+)\s*((\$\%)\s{2}(?<unions>.+)))|(\s{2}(?<unionSet>.+)\s{2}\?\((?<union>.+)\))/gm
                    const matching = [...hoon.replace(member, '').matchAll(corePattern)]
                    const reduced = matching.filter(m => {
                    const listPattern = /\(list (.+)\)/g
                    // console.log(process.exit())
                        if(m.groups.members){
                            const listMatch = [...m.groups.members.matchAll(listPattern)]
                            if(listMatch.length > 0){
                                if(!types[m.groups.type.trim()][m.groups.members.split('=')[0]]) {
                                    types[m.groups.type.trim()][m.groups.members.split('=')[0]] = {}
                                    types[m.groups.type.trim()][m.groups.members.split('=')[0]]['list'] = listMatch[0][1]
                                }
                            }
                        }
                        return m.groups.members&&!types[m.groups.members.split('=')[0]]&&!m.groups.members.includes('list')
                    })
                    const ingreeds = matching.filter(m => {
                        if(m.groups.members&&types[m.groups.members.split('=')[0]]){
                            membersParse(matching[0].input, m.groups.members)
                        }
                    })
                    const noLists = matching.filter(m => m.groups.members&&m.groups.members.includes('list')&&m.groups.members)
                    if(noLists.length > 0 ) membersParse(noLists[0].input, noLists[0].groups.members)
                    const ingreds = noLists.filter(m => !m.groups.members.includes('list')&&types[m.groups.members.split('=')[0]])
                    if(reduced.length > 0){
                        const goods = matching.filter(m => m.groups.type&&m.groups.members&&!types[m.groups.members.split('=')[0]]&&!m.groups.members.includes('list'))
                        if(goods){
                            types[goods[0].groups.type.trim()][goods[0].groups.members.split('=')[0]] = goods[0].groups.members.split('=')[1]
                            membersParse(matching[0].input, goods[0].groups.members)
                        } 
                    } else {
                        return
                    }
                }
                const members = matched.filter(match => match.groups.members != undefined)
                members.forEach((tt) => {
                    if(tt[12] == '(list @t)' &&!types[tt.groups.type.trim()][tt.groups.members.split('=')[0]]){
                        const listPattern = /\(list (.+)\)/g
                        const listMatch = [...tt[12].matchAll(listPattern)]
                        types[tt.groups.type.trim()][tt.groups.members.split('=')[0]] = listMatch[0][1]

                    } else if(!types[tt.groups.type.trim()][tt.groups.members.split('=')[0]]){
                        types[tt.groups.type.trim()][tt.groups.members.split('=')[0]] = tt[12]
                    } 
                    // else if(tt[12] == '(list @t)'){
                        // types[tt.groups.type.trim()][tt.groups.members.split('=')[0]] = tt[12]

                    // }
                })
                
                const sansList = members.filter(m => !m.groups.members.includes('list'))
                // console.log(sansList)
                if(sansList.length > 0) membersParse(hoon,sansList[0].groups.members)
                return types
                break;
        }
    }
}

if(process) {
    module.exports = CompilerProducer
} else {
 //export default CompilerProducer
}

