CARDS_URL = 'http://wow.zamimg.com/images/hearthstone/cards/enus/original/'

if (!localStorage.getItem('cards')){
    $.getJSON('./AllSets.enUS.json', function(cards){
        localStorage.setItem('cards', JSON.stringify(cards));
        setUpTable();
    });
} else {
    setUpTable();
}

function setUpTable(){
    window.cards = JSON.parse(localStorage.getItem('cards'));
    var table = $('tbody');
    $('#hide-uncollectible').prop('checked', true);
    $('.search').val('');
    $.each(cards, function(set_name, set){
        if (set_name != 'Debug' && set_name != "Promotion") {
            $.each(set, function(index, card){
                if (card.hasOwnProperty('cost') && card.hasOwnProperty('rarity') && card.type != "Hero Power" && card.type != "Hero") {
                    var row = $('<tr class="' + (card.collectible ? 'collectible' : 'uncollectible hide') + '">');
                    row.append($('<td class="cost text-center">' + card.cost + '</td>'));
                    row.append($('<td class="name">' + card.name + '</td>'));

                    if (card.hasOwnProperty('attack')) {
                        row.append($('<td class="text-center">' + card.attack + '</td>'));
                    } else {
                        row.append($('<td></td>'));
                    }

                    if (card.hasOwnProperty('health')) {
                        row.append($('<td class="text-center">' + card.health + '</td>'));
                    } else if (card.hasOwnProperty('duration')) {
                        row.append($('<td class="text-center">' + card.durability + '</td>'));
                    } else {
                        row.append($('<td></td>'));
                    }

                    if (card.hasOwnProperty('text')) {
                        row.append($('<td class="text">' + card.text.replace(/\$([0-9]+)/, '*$1*' ) + '</td>'));
                    } else {
                        row.append($('<td></td>'));
                    }

                    if (card.hasOwnProperty('race')) {
                        row.append($('<td class="race">' + card.race + '</td>'));
                    } else {
                        row.append($('<td class="race"></td>'));
                    }

                    row.append($('<td class="set ' + card.rarity.toLowerCase() + '">' + set_name + '</td>'));
                    row.append($('<td><a target="_blank" href="' + CARDS_URL + card.id + '.png">Image</a></td>'))
                    table.append(row);
                }
            });
        }
    });

    // Don't submit form on button press
    $('form').on('submit', function(e){
        e.preventDefault();
    });

    // Filters
    var options = {
      valueNames: [ 'name', 'cost', 'race', 'text']
    };

    var cardList = new List('content', options);

    $('#hide-uncollectible').on('change', function(e){
        $('.uncollectible').removeClass('hide');
        if (this.checked) {
            $('.uncollectible').addClass('hide');
        }
    });
}
