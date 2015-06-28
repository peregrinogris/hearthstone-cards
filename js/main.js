CARDS_URL = 'http://wow.gamimg.com/images/hearthstone/cards/enus/original/'
CARDS_URL = './cards/'

if (!localStorage.getItem('cards')){
    $.getJSON('./AllSets.enUS.json', function(cards){
        localStorage.setItem('cards', JSON.stringify(cards));
        setUpTable();
    });
} else {
    setUpTable();
}

function setUpTable(){
    var cards = JSON.parse(localStorage.getItem('cards'));
    var table = $('tbody');
    $.each(cards, function(set_name, set){
        if (set_name != 'Debug' && set_name != "Promotion") {
            $.each(set, function(index, card){
                if (card.hasOwnProperty('cost') && card.type != "Hero Power" && card.type != "Hero") {
                    var row = $('<tr>');
                    row.append($('<td class="cost">' + card.cost + '</td>'));
                    row.append($('<td class="name">' + card.name + '</td>'));

                    if (card.hasOwnProperty('attack')) {
                        row.append($('<td>' + card.attack + '</td>'));
                    } else {
                        row.append($('<td></td>'));
                    }

                    if (card.hasOwnProperty('health')) {
                        row.append($('<td>' + card.health + '</td>'));
                    } else if (card.hasOwnProperty('duration')) {
                        row.append($('<td>' + card.durability + '</td>'));
                    } else {
                        row.append($('<td></td>'));
                    }

                    if (card.hasOwnProperty('text')) {
                        row.append($('<td>' + card.text.replace(/\$([0-9]+)/, '*$1*' ) + '</td>'));
                    } else {
                        row.append($('<td></td>'));
                    }

                    if (card.hasOwnProperty('race')) {
                        row.append($('<td class="race">' + card.race + '</td>'));
                    } else {
                        row.append($('<td class="race"></td>'));
                    }

                    row.append($('<td>' + set_name + '</td>'));
                    row.append($('<td><a target="_blank" href="' + CARDS_URL + card.id + '.png">Image</a></td>'))
                    table.append(row);
                }
            });
        }
    });

    // Filters
    var options = {
      valueNames: [ 'name', 'cost', 'race' ]
    };

    var cardList = new List('cards', options);

}
