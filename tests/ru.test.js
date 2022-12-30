
var { Rhymer } = require('../src/rhymer');

test('Russian rhymes for geography by end of word', () => {
    var input = 'география';
    var expected = [
        'Автобиография', 'Археография', 'Атрофия',
        'Библиография', 'Биография', 'Гидрография',
        'Гипертрофия', 'Голография', 'Демография',
        'Дистрофия', 'Зоогеография', 'Идеография',
        'Иконография', 'Историография', 'Каллиграфия',
        'Картография', 'Кинематография', 'Криптография',
        'Кристаллография', 'Ксерография', 'Лексикография',
        'Литография', 'Мафия', 'Монография',
        'Натурфилософия', 'Олеография', 'Орфография',
        'Палеография', 'Петрография', 'Пиктография',
        'Полиграфия', 'Порнография', 'Рентгенография',
        'Сейсмография', 'Стеклография', 'Стенография',
        'Сценография', 'Телеграфия', 'Теософия',
        'Типография', 'Топография', 'Фактография',
        'Философия', 'Флюроография', 'Фотография',
        'Хореография', 'Цинкография', 'Эпитафия',
        'Этнография'
    ];
    var result = Rhymer.findByEnd(input);
    expect(result).toContain(expected[10]);
    expect(result).toHaveLength(expected.length);

});

test('Russian rhymes for geography by start of word', () => {
    var input = 'география';
    var expected = [
        'Географ',
        'Геодезист',
        'Геодезия',
        'Геолог',
        'Геология',
        'Геологоразведка',
        'Геологоразведчик',
        'Геометр',
        'Геометрия',
        'Георгин'
    ];
    var result = Rhymer.findByStart(input);

    expect(result).toContain(expected[5]);
    expect(result).toHaveLength(expected.length);
});

test('Check that original word is not in result', () => {
    var input = 'география';
    var resultByStart = Rhymer.findByStart(input);
    var resultByEnd = Rhymer.findByEnd(input);

    expect(resultByStart).not.toContain(input);
    expect(resultByEnd).not.toContain(input);
});

test('Check for invalid input', () => {
    expect(Rhymer.findByStart('')).toHaveLength(0);
    expect(Rhymer.findByStart(' ')).toHaveLength(0);
    expect(Rhymer.findByStart(' а ')).toHaveLength(0);
    expect(Rhymer.findByStart(' а б в ')).toHaveLength(0);
    expect(Rhymer.findByStart('!"№;%:?*(){}[]_+\/')).toHaveLength(0);
    expect(Rhymer.findByStart(null)).toHaveLength(0);
    expect(Rhymer.findByStart(false)).toHaveLength(0);
    expect(Rhymer.findByStart(undefined)).toHaveLength(0);
    expect(Rhymer.findByStart([])).toHaveLength(0);
    expect(Rhymer.findByStart({})).toHaveLength(0);
});