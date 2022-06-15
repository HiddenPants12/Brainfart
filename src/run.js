'use strict';
const fileDir = process.argv[2];
const dumbBuffer = true;
const bufferLength = 30000;
const fs = require('fs');
var file = fs.readFileSync(fileDir, 'utf8');

var args = '';
function getArgs(a) {
    var args = '';
    for (var i = 3; i < a.length; i++) {
        args += a[i] + (i < a.length - 1 ? ' ' : '');
    }
    return args;
}
args = getArgs(process.argv);

function balanceOut(code, open, closed, index) {
    var openCount = 0;
    for (var i = index; i < code.length; i++) {
        if (code[i] === open) {
            openCount++;
        } else if (code[i] === closed) {
            openCount--;
        }
        if (openCount === 0) {
            return i;
        }
    }
}

function balanceIn(code, open, closed, index) {
    var openCount = 0;
    for (var i = index; i < code.length; i--) {
        if (code[i] === open) {
            openCount--;
        } else if (code[i] === closed) {
            openCount++;
        }
        if (openCount === 0) {
            return i;
        }
    }
}

function run(code) {
    var buffer = new Uint32Array(bufferLength);
    var ptr = 0;
    var argI = 0;
    var codeRead = 0;

    var registers = {
        a: 0,
        b: 0,
        c: 0,
        d: 0
    };

    for (var i = 0; i < code.length; i++) {
        var instruction = code.charAt(i);
        codeRead++;

        switch(instruction) {
            case '<': 
                ptr--;
                break;
            case '>':
                ptr++;
                break;
            case '+':
                buffer[ptr]++;
                break;
            case '-':
                buffer[ptr]--;
                break;
            case '.':
                process.stdout.write(String.fromCharCode(buffer[ptr]))
                break;
            case ',':
                buffer[ptr] = args.charCodeAt(argI) ? args.charCodeAt(argI) : 0;
                argI++;
                break;
            case '[':
                if (buffer[ptr] == 0) i = balanceOut(code, '[', ']', i);
                break;
            case ']':
                i = balanceIn(code, '[', ']', i) - 1;
                break;
            case 's':
                registers[code.charAt(i + 1)] = buffer[ptr];
                i++;
                break;
            case 'p':
                buffer[ptr] = registers[code.charAt(i + 1)];
                i++;
                break;
            case '!':
                var reg = code.charAt(i + 1);
                code.charAt(i + 2) == '-' ? registers[reg]-- : (code.charAt(i + 2) == '+' ? registers[reg]++ : (code.charAt(i + 2) == 't' ? registers[reg] += buffer[ptr] : registers[reg] += registers[code.charAt(i + 2)]));
                i += 2;
                break;
            case 'c':
                var reg = code.charAt(i + 1);
                if (reg == 't') {
                    buffer[ptr] = 0;
                } else {
                    registers[reg] = 0;
                }
                i++;
                break;
            case '$':
                var nextLineBreak = code.indexOf('\n', i);
                i = nextLineBreak != -1 ? nextLineBreak : code.length;
                break;
            case 'A':
                var arg0 = code.charAt(i + 1);
                var arg1 = code.charAt(i + 2);
                buffer[ptr] = (arg0 == 't' ? buffer[ptr] : registers[arg0]) + (arg1 == 't' ? buffer[ptr] : registers[arg1]);
                i += 2;
                break;
            case 'S':
                var arg0 = code.charAt(i + 1);
                var arg1 = code.charAt(i + 2);
                buffer[ptr] = (arg0 == 't' ? buffer[ptr] : registers[arg0]) - (arg1 == 't' ? buffer[ptr] : registers[arg1]);
                i += 2;
                break;
            case 'M':
                var arg0 = code.charAt(i + 1);
                var arg1 = code.charAt(i + 2);
                buffer[ptr] = (arg0 == 't' ? buffer[ptr] : registers[arg0]) * (arg1 == 't' ? buffer[ptr] : registers[arg1]);
                i += 2;
                break;
            case 'D':
                var arg0 = code.charAt(i + 1);
                var arg1 = code.charAt(i + 2);
                buffer[ptr] = Math.round((arg0 == 't' ? buffer[ptr] : registers[arg0]) / (arg1 == 't' ? buffer[ptr] : registers[arg1]));
                i += 2;
                break;
            case '_':
                var arg0 = code.charAt(i + 1);
                var arg1 = code.charAt(i + 2);
                if (arg0 != '+' && arg0 != '-') throw new Error('Invalid argument');
                ptr += (arg0 == '-' ? -1 : 1) * (arg1 == 't' ? buffer[ptr] : registers[arg1]);
                i += 2;
                break;
            case 'e':
                var arg0 = code.charAt(i + 1);
                var arg1 = code.charAt(i + 2);
                var arg2 = code.charAt(i + 3);
                if (arg0 == 'c') {
                    registers[arg1] = (arg2 == 't' ? buffer[ptr] : (arg2 == '0' ? 0 : registers[arg2]));
                    i += 3;
                } else if (arg0 == 'd') {
                    if (arg1 == 'a' || arg1 == 'b' || arg1 == 'c' || arg1 == 'd') throw new Error('Cannot delete default register.');
                    delete registers[arg1];
                    i += 2;
                }else if (arg0 == 'e') {
                    buffer[ptr] = (registers[arg1] ? 1 : 0);
                    i += 2;
                } else {
                    throw new Error("The 'e' instruction only accepts 'c', for create, 'd', for delete, and 'e' for exists.");
                }
                break;
            case 'd':
                var arg1 = code.charAt(i + 1);
                var arg0 = code.charAt(i + 2);
                if (arg0 == 't') {
                    buffer[ptr] = (arg1 == 't' ? buffer[ptr] : (!isNaN(parseInt(arg1)) ? buffer[ptr + parseInt(arg1)] : registers[arg1]));
                } else if (!isNaN(parseInt(arg0))) {
                    buffer[ptr + parseInt(arg0)] = (arg1 == 't' ? buffer[ptr] : (!isNaN(parseInt(arg1)) ? buffer[ptr + parseInt(arg1)] : registers[arg1]));
                } else {
                    registers[arg0] = (arg1 == 't' ? buffer[ptr] : (!isNaN(parseInt(arg1)) ? buffer[ptr + parseInt(arg1)] : registers[arg1]));
                }
                i += 2;
                break;
            default:
                codeRead--;
                if (instruction == ' ' || instruction == '\n' || instruction == '\r') {
                    break;
                } else {
                    throw new Error('Unknown instruction: ' + instruction);
                }
        }
    }

    console.log("Total read: " + codeRead);
    return buffer;
}

var startTime = new Date().getTime();
console.log('\n' + run(file).subarray(0, 50));
var endTime = new Date().getTime();
console.log('\nRunning took: ' + (endTime - startTime) + 'ms');