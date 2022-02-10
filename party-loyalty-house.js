class Statistics {
    constructor(partyStats, leastLoyal, mostLoyal) {
      this.partyStats = partyStats;
      this.leastLoyal = leastLoyal;
      this.mostLoyal = mostLoyal;
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

    const leastLoyal = getLeastLoyal(members);
    const mostLoyal = getMostLoyal(members);

    return new Statistics(partyStats, leastLoyal, mostLoyal);
}

function getMostLoyal(members) {
    const index = Math.round(0.1 * members.length);
    const membersSorted = members.sort((a,b) => (a.total_votes*a.votes_with_party_pct > b.total_votes*b.votes_with_party_pct) ? -1 : ((b.total_votes*b.votes_with_party_pct > a.total_votes*a.votes_with_party_pct) ? 1 : 0));
    return membersSorted.slice(0, index);
}

function getLeastLoyal(members) {
    const index = Math.round(0.1 * members.length);
    const membersSorted = members.sort((a,b) => (a.total_votes*a.votes_with_party_pct > b.total_votes*b.votes_with_party_pct) ? 1 : ((b.total_votes*b.votes_with_party_pct > a.total_votes*a.votes_with_party_pct) ? -1 : 0));
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