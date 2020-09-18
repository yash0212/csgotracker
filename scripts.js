var endpoint = 'https://hltv-api.vercel.app/api/',
    proxyUrl = 'https://cors-anywhere.herokuapp.com/';

$(document).ready(() => {
    // Add a hashchange eventlistener for tab change
    window.onhashchange = () => {
        // Hide default text
        $("#default-text").addClass('hide');

        let hash = location.hash.substr(1);     // substr function to remove the preceding # in hashname
        // Hide all tabs
        $("#ongoing").addClass('hide');
        $("#upcoming").addClass('hide');
        $("#results").addClass('hide');
        // Unhide the requested tab
        $("#"+hash).removeClass('hide');
        switch(hash) {
            case 'ongoing':
                loadOngoing();
                break;
            case 'upcoming':
                loadUpcoming();
                break;
            case 'results':
                loadResults();
                break;
        }
    }

    // Eventlistener to open links of match
    $(".ongoing-card").on('click', (e) => {
        console.log($(e.target).attr('data-match-link'))
    })
});

var loadOngoing = () => {
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
                let matchCard = $(".ongoing-card-clone").clone();
                matchCard = matchCard.children(".ongoing-card");
                matchCard.attr('data-match-id', match.id);
                matchCard.attr('data-match-link', match.link);
                matchCard.removeClass('hide');
                matchCard.children('.match-name').html(match.event.name);
                matchCard.children('.match-crest').attr('src', match.event.crest);
                matchCard.children('.map').children('span').val(match.map);
                matchCard.children('.teams').children('.team1').children('.team1-name').html(match.teams[0].name);
                matchCard.children('.teams').children('.team1').children('.team-crest').attr('src', match.teams[0].crest);
                matchCard.children('.teams').children('.team2').children('.team2-name').html(match.teams[1].name);
                matchCard.children('.teams').children('.team2').children('.team-crest').attr('src', match.teams[1].crest);
                // Parse time
                let time = new Date(match.time).toLocaleDateString();
                time += " ";
                time += new Date(match.time).toLocaleTimeString()
                matchCard.children('.time').html(time);
                $("#ongoing").append(matchCard);
            }
        });
    })
}