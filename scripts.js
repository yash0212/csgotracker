var endpoint = 'https://hltv-api.vercel.app/api/',
    proxyUrl = 'https://cors-anywhere.herokuapp.com/';

$(document).ready(() => {
    // Add a hashchange eventlistener for tab change
    window.onhashchange = updatePage;
    
    // Eventlistener to open links of match
    $(document).on("click", ".upcoming-card", (e) => {
        window.open('https://www.hltv.org' + $(e.target).closest('.upcoming-card').attr('data-match-link'));
    });
    $(document).on("click", ".result-card", (e) => {
        window.open('https://www.hltv.org' + $(e.target).closest('.result-card').attr('data-match-link'));
    });
});

var updatePage = () => {
    // Hide default text
    $("#default-text").addClass('hide');

    let hash = location.hash.substr(1);     // substr function to remove the preceding # in hashname
    // Hide all tabs
    $("#upcoming").addClass('hide');
    $("#results").addClass('hide');
    $("#upcoming").html('');
    $("#results").html('');
    // Unhide the requested tab
    $("#" + hash).removeClass('hide');
    switch (hash) {
        case 'upcoming':
            loadUpcoming();
            break;
        case 'results':
            loadResults();
            break;
    }
}

var loadUpcoming = () => {
    fetch(proxyUrl+endpoint+"matches")
    .then(res=>res.json())  // Parse response into json
    .then(matchData=>{
        // Sort the matches according to their time
        matchData.sort((a, b) => {
            let matchATime = new Date(a.time).getTime();
            let matchBTime = new Date(b.time).getTime();
            return matchATime < matchBTime;
        });

        matchData.forEach(match => {
            if (match.event.name !== undefined && match.event.name !== "") {
                // Create a clone of card
                let matchCard = $(".upcoming-card-clone").clone();
                matchCard = matchCard.children(".upcoming-card");
                matchCard.attr('data-match-id', match.id);
                matchCard.attr('data-match-link', match.link);
                matchCard.removeClass('hide');
                matchCard.children('.match-name').html(match.event.name);
                matchCard.children('.match-crest').attr('src', match.event.crest);
                matchCard.children('.map').children('.map-data').html(match.map);
                matchCard.children('.teams').children('.team1').children('.team1-name').html(match.teams[0].name);
                matchCard.children('.teams').children('.team1').children('.team-crest').attr('src', match.teams[0].crest);
                matchCard.children('.teams').children('.team2').children('.team2-name').html(match.teams[1].name);
                matchCard.children('.teams').children('.team2').children('.team-crest').attr('src', match.teams[1].crest);
                // Parse time
                let time = new Date(match.time).toLocaleDateString();
                time += " ";
                time += new Date(match.time).toLocaleTimeString()
                matchCard.children('.time').html(time);
                $("#upcoming").append(matchCard);
            }
        });
    });
}

var loadResults = () => {
    fetch(proxyUrl+endpoint+"results")
    .then(res=>res.json())  // Parse response into json
    .then(resultsData=>{
        resultsData.forEach(match => {
            if (match.event !== undefined && match.event !== "") {
                // Create a clone of card
                let matchCard = $(".result-card-clone").clone();
                matchCard = matchCard.children(".result-card");
                matchCard.attr('data-match-link', match.matchId);
                matchCard.removeClass('hide');
                matchCard.children('.match-name').html(match.event);
                matchCard.children('.match-crest').attr('src', match.event.crest);
                matchCard.children('.map').children('.map-data').html(match.maps);
                matchCard.children('.teams').children('.team1').children('.team1-name').html(match.team1.name);
                matchCard.children('.teams').children('.team1').children('.team-crest').attr('src', match.team1.crest);
                matchCard.children('.teams').children('.team1').children('.team1-score').html(match.team1.result);
                matchCard.children('.teams').children('.team2').children('.team2-name').html(match.team2.name);
                matchCard.children('.teams').children('.team2').children('.team-crest').attr('src', match.team2.crest);
                matchCard.children('.teams').children('.team2').children('.team2-score').html(match.team2.result);
                // Add classes for winning team and losing team
                if(match.team1.result > match.team1.result) {
                    matchCard.children('.teams').children('.team1').addClass('winner');
                    matchCard.children('.teams').children('.team2').addClass('loser');
                } else {
                    matchCard.children('.teams').children('.team2').addClass('winner');
                    matchCard.children('.teams').children('.team1').addClass('loser');
                }

                $("#results").append(matchCard);
            }
        });
    });
}