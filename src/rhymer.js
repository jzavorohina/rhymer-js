/**
 * /////////////
 * // Rhymer //
 * ///////////
 * 
 * A JavaScript lib for finding rhymes to words.
 * 
 * Key features:
 * - Finds rhymes to the word by the first syllable at the beginning of the word (for Russian words).
 * - Finds rhymes to the word by the last syllable at the end of the word (for Russian words).
 *
 * Some examples:
 * Rhymer.findByStart('Key word'); // return: array
 * Rhymer.findByEnd('Key word'); // return: array
 * 
 * @author jzavorohina@yandex.ru
 * 
 */

const fsLibrary = require('fs');

class Rhymer {

    static GROUPS = {
        "vowels": ['а', 'е', 'ё', 'и', 'о', 'у', 'э', 'ю', 'я'],
        "consonantsSonorousOnly": ['л', 'м', 'н', 'р', 'й'],
        "consonantsSonorous": ['б', 'в', 'г', 'д', 'з', 'ж'],
        "consonantsMuffled": ['к', 'п', 'с', 'ф', 'т', 'ш', 'щ', 'х', 'ц', 'ч']
    }
    static GROUPS_IDS = {
        "vowels": 4,
        "consonantsSonorousOnly": 3,
        "consonantsSonorous": 2,
        "consonantsMuffled": 1
    };

    /**
     * Find rhymes by start of the word
     * 
     * @param string string - input word	 
     * @return array - found rhymes
     */
    static findByStart(string) {
        return Rhymer.find(string, false);
    }

    /**
     * Find rhymes by end of the word
     * 
     * @param string string - input word	 
     * @return array - found rhymes
     */
    static findByEnd(string) {
        return Rhymer.find(string, true);
    }

    static find(string, end = true) {
        if (!string || typeof string !== 'string') {
            return [];
        }

        var inputString = string.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');

        if (inputString.length < 1) {
            return [];
        }

        var result = [];
        var parsed = Rhymer.parseString(inputString);
        var pattern = Rhymer.getRegExp(parsed, 2, end);

        var wordsBase = fsLibrary.readFileSync(__dirname + '/wordsBase.txt', {encoding:'utf8', flag:'r'});
        var words = wordsBase.split("\n");

        for (var word of words) {
            var trimmed = word.trim();
            if (pattern.test(trimmed) && trimmed.toLowerCase() !== inputString.toLowerCase()) {
                result.push(trimmed);
            }
        }

        return result;
    }

    static getRegExp(slogi, num = 1, end = true) {
        if (!Array.isArray(slogi)) {
            throw new Exception("Some esxception");
        }

        var keys = [];
        var set = [];
        var reverse = [...slogi].reverse();
        var pattern = "";

        // TODO - num must be equal to num of slogs
        for (var i = 0; i < num; i++) {
            keys.push(i);
        }

        for (var key of keys) {
            set.push((end) ? reverse[key] : slogi[key]);
        }

        if (end) {
            set = set.reverse();
        }

        pattern = (end) ? set.join("") + '$' : '^' + set.join("");
    
        return new RegExp(pattern, 'iu');
    }

    static parseString(string) {
        var result = "";
        var stringByGroupIds = {};
        var strLen = Rhymer.mbStrlen(string);
        var symbols = string.split('');

        if (symbols.length < 1) {
            return [];
        }

        for (var key = 0; key < symbols.length; key++) {
            var word = symbols[key];
            var found = false;

            for (var groupKey of Object.keys(Rhymer.GROUPS)) {
                var group = Rhymer.GROUPS[groupKey];

                var isInGroup = group.includes(word.toLowerCase());
                if (isInGroup) {
                    stringByGroupIds[key] = Rhymer.GROUPS_IDS[groupKey];
                    found = true;
                    break;
                }
            }

            if (!found) {
                stringByGroupIds[key] = symbols[key];
            }
        }

        for (var k of Object.keys(stringByGroupIds)) {
            var groupId = stringByGroupIds[+k];
            var nextGroupId = (strLen === +k + 1) ? stringByGroupIds[+k] : stringByGroupIds[+k + 1];

            if (groupId - nextGroupId == 0 && nextGroupId == Rhymer.GROUPS_IDS["vowels"]) {
                result += symbols[k] + ((strLen !== +k + 1) ? "-" : "");
            } else {
                if (!Rhymer.isNumeric(nextGroupId) || groupId - nextGroupId <= 0) {
                    result += symbols[+k];
                } else {
                    result += symbols[+k] + "-";
                }
            }
        }

        return result.split("-");
    }

    static mbStrlen(str) {
        return str.replace(/[\u{FE00}-\u{FE0F}]/ug, '').length
    }

    static isNumeric(value) {
        return !isNaN(value - parseFloat(value));
    }

}

module.exports = {
    Rhymer
};
