CARDS_URL = 'http://wow.zamimg.com/images/hearthstone/cards/enus/original/'
CARDS_VERSION = '2015-06-27';

if (downloadRequired()){
    $.getJSON('./AllSets.enUS.json', function(cards){
        localStorage.setItem('cards', JSON.stringify(cards));
        localStorage.setItem('version', CARDS_VERSION);
        setUpTable();
    });
} else {
    setUpTable();
}

function downloadRequired(){
    cardsPresent = localStorage.hasOwnProperty('cards')
    if (cardsPresent) {
        return localStorage.getItem('version') != CARDS_VERSION
    } else {
        return true
    }
}

function setUpTable(){
    var cards = JSON.parse(localStorage.getItem('cards'));
    var table = $('tbody');
    $('#hide-uncollectible').prop('checked', true);
    $('.search').val('');
    $.each(cards, function(set_name, set){
        if (set_name != 'Debug' && set_name != "Promotion") {
            $.each(set, function(index, card){
                if (card.hasOwnProperty('cost') && card.hasOwnProperty('rarity') && card.type != "Hero Power" && card.type != "Hero") {
                    var row = $('<tr class="' + (card.collectible ? 'collectible' : 'uncollectible') + '">');
                    row.append($('<td class="cost text-center">' + card.cost + '</td>'));
                    row.append($('<td class="name">' + card.name + '</td>'));

                    if (card.hasOwnProperty('attack')) {
                        row.append($('<td class="attack text-center">' + card.attack + '</td>'));
                    } else {
                        row.append($('<td class="attack empty"></td>'));
                    }

                    if (card.hasOwnProperty('health')) {
                        row.append($('<td class="health text-center">' + card.health + '</td>'));
                    } else if (card.hasOwnProperty('duration')) {
                        row.append($('<td class="durability text-center">' + card.durability + '</td>'));
                    } else {
                        row.append($('<td class="health empty"></td>'));
                    }

                    if (card.hasOwnProperty('text')) {
                        row.append($('<td class="text">' + card.text.replace(/\$([0-9]+)/g, '*$1*' ) + '</td>'));
                    } else {
                        row.append($('<td class="text empty"></td>'));
                    }

                    if (card.hasOwnProperty('race')) {
                        row.append($('<td class="race">' + card.race + '</td>'));
                    } else {
                        row.append($('<td class="race empty"></td>'));
                    }

                    row.append($('<td class="set ' + card.rarity.toLowerCase() + '">' + set_name + '</td>'));
                    row.append($('<td><a target="_blank" href="' + CARDS_URL + card.id + '.png">Image</a></td>'))
                    table.append(row);
                }
            });
        }
    });

    // Simple mobile check to change a bit the search behavior
    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // Don't submit form on button press
    $('form').on('submit', function(e){
        e.preventDefault();
    });

    // Filters
    var options = {
      valueNames: [ 'name', 'cost', 'race', 'text'],
      searchClass: isMobile ? null : 'search',
      page: isMobile ? 20 : 200
    };

    var cardList = new List('content', options);

    // If on mobile, don't use the `keyup` default search, as it triggers too
    // much and is usually hidden by the keyboard, so use `change` event.
    if (isMobile) {
        $('.search').on('change', function(){
            cardList.search(this.value);
        })
    }

    $('#hide-uncollectible').on('change', function(e){
        $('.cards').removeClass('hide-uncollectible');
        if (this.checked) {
            $('.cards').addClass('hide-uncollectible');
        }
    });
}
