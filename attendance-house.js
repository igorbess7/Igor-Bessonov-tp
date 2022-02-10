class Statistics {
    constructor(partyStats, leastEngaged, mostEngaged) {
      this.partyStats = partyStats;
      this.leastEngaged = leastEngaged;
      this.mostEngaged = mostEngaged;
    }
}

class PartyStats {
    constructor(name, totalMembers, percentageOfTotal) {
        this.name = name;
        this.totalMembers = totalMembers;
        this.percentageOfTotal = percentageOfTotal;
    }
}

function buildStats(data) {
    let members = data.results[0].members;

    const total = members.length;
    const democrats = members.filter(member => member.party == "D").length;
    const republicans = members.filter(member => member.party == "R").length;
    const independents = members.filter(member => member.party == "I").length;
    
    const democratsStats = new PartyStats("Democrats", democrats, democrats*100/total);
    const republicansStats = new PartyStats("Republicans", republicans, republicans*100/total);
    const independentsStats = new PartyStats("Independents", independents, independents*100/total);

    const totalStats = new PartyStats("Total", democrats + republicans + independents, 100);

    const partyStats = [democratsStats, republicansStats, independentsStats, totalStats];

    const leastEngaged = getLeastEngaged(members);
    const mostEngaged = getMostEngaged(members);

    return new Statistics(partyStats, leastEngaged, mostEngaged);
}

function getLeastEngaged(members) {
    const index = Math.round(0.1 * members.length);
    const membersSorted = members.sort((a,b) => (a.missed_votes > b.missed_votes) ? -1 : ((b.missed_votes > a.missed_votes) ? 1 : 0));
    return membersSorted.slice(0, index);
}

function getMostEngaged(members) {
    const index = Math.round(0.1 * members.length);
    const membersSorted = members.sort((a,b) => (a.missed_votes > b.missed_votes) ? 1 : ((b.missed_votes > a.missed_votes) ? -1 : 0));
    return membersSorted.slice(0, index);
}

function start() {
    new Vue({
        el: '#app',
        data() {
            return {
                data: {}
            }
        },
        mounted() {
            axios
                .get('https://api.propublica.org/congress/v1/117/house/members.json', {
                    headers: {
                        "X-API-Key": "YC2p1NrpiKZcGL5euwEAshBNYk7QOOsPIyh2WqEI"
                    }
                })
                .then(response => (this.data = buildStats(response.data)))
        } 
    });
}


start();
