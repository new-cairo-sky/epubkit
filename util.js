var S = require('string');
var archiver = require('archiver');
var fs = require('fs');

module.exports = {

    /*
        Determines if one selector is equal to or a subset of another
        Super:           Sub:
        span.apple  ---> span.apple
        .apple      ---> span.apple
        span.banana -x-> span.apple
        p           -x-> span
    */
    selectorClassSubset: function(superSel, subSel) {

        if (subSel === superSel) return true;

        var superSelSplit  = superSel.split('.'),
            subSelSplit    = subSel.split('.');

        if (superSelSplit.length === 1) return false;

        if (superSelSplit[0] === '' && subSelSplit[1] === superSelSplit[1]) {
            return true;
        }

        return false;
    },

    selectorAsClass: function(sel){

        // If the selector is just for an element, a simple class, or contains an asterisk, we don't alter the selector.
        if (sel.match(/^\.?[a-zA-Z0-9_-]+$/) || sel.match(/\*([^=]|$)/) || sel.match(/^[a-zA-Z0-9]+\.[a-zA-Z0-9_-]+$/)) return sel; // 'div' or '.apple' '*' or 'div *' or 'span.apple'

        // Create a simplified version of the selector
        return '.' + sel.replace(/ /g, '-')
            .replace(/("[^"]*)\.([^"]*")/,  '$1-dot-$2')
            .replace(/"/g,      '')
            .replace(/\*=/g,    '-in-')
            .replace(/~=/g,     '-win-')
            .replace(/\^=/g,    '-beg-')
            .replace(/\|=/g,    '-wbeg-')
            .replace(/\$=/g,    '-end-')
            .replace(/#/g,      '-id-')
            .replace(/\./g,     '-clz-')
            .replace(/\+/g,     '-adj-')
            .replace(/~/g,      '-pre-')
            .replace(/>/g,      '-chl-')
            .replace(/\[/g,     '-attr-')
            .replace(/\]/g,     '-rtta-')
            .replace(/=/g,      '-eq-')
            .replace(/-{2,}/g,  '-')
            .replace(/^-/,      '')
            .replace(/-$/,      '');
    },

    walkCheerio: function($, part, callbk){
        callbk(part);
        var self = this;
        part.children().each(function(){
            self.walkCheerio($, $(this), callbk);
        });
    },

    selectorToElement: function(selector){
        var s = selector.split('.');
        var el = s[0];
        var clz = s[1];
        return '<' + el + ' class="' + clz + '"></' + el + '>'
    },

    zipEpub: function(dirPath, targetPath, callback){

        if (!S(targetPath).endsWith('.epub')) {
            targetPath += ".epub";
        }

        var archive = archiver.create('zip', {});
        var output = fs.createWriteStream(targetPath);

        output.on('close', function() {
            // console.log(archive.pointer() + ' total bytes');
            // console.log('archiver has been finalized and the output file descriptor has closed.');
            callback(targetPath);
        });

        archive.on('error', function(err) {
            callback(null, err);
        });

        archive.pipe(output);

        archive.bulk([
            { expand: true, cwd: dirPath, src: 'mimetype', data: { store: true } },
            { expand: true, cwd: dirPath, src: ['**', '!mimetype'] }
        ]).finalize();
    },

    setOnRule: function(rule, propName, setVal) {
        var set = false;
        if (!rule.declarations) throw new Error('setOnRule: Rule has no declarations!');
        rule.declarations.forEach(function(dec){
            if (dec.property === propName) {
                dec.value = setVal;
                set = true;
            }
        });
        if (set) return;
        rule.declarations.push({
            property:   propName,
            value:      setVal,
            type: "declaration"
        });
    }

}