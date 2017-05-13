
export class Route {
    id: number;
    title: string;
    description: string;
    duration: number;
    distance: number;
    image: number;
    audio: number;
    // exhibits: Exhibit[];
    status: string;
    // tags: Tag[];
    timestamp: string;
    static emptyRoute() {
        return new Route(-1, '', '', 0 , 0, 0, 0, '', '');
    }
    static getRandom() {
        let x = new Route(-1, '', '', 0 , 0, 0, 0, '', '');
        x.description = 'Lorem' + ' impsum'.repeat(Math.round(Math.random() * 15));
        x.image       = Math.round(Math.random() * 100);
        x.title    = 'Route No. ' + (Math.random() * 100).toFixed(0);
        x.id          = Math.round(Math.random() * 100);
        x.audio        = Math.random();
        x.duration = Math.round(Math.random() * 100);
        x.distance = Math.round(Math.random() * 100);
        x.status = 'Published';
        return x;
    }
    constructor( id: number,
                 title: string,
                 description: string,
                 duration: number,
                 distance: number,
                 image: number,
                 audio: number,
                 // exhibits: Exhibit[],
                 status: string,
                 // tags: Tag[],
                 timestamp: string) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.duration = duration;
        this.distance = distance;
        this.image = image;
        this.audio = audio;
        // this.exhibits = exhibits;
        this.status = status;
        // this.tags = tags;
        this.timestamp = timestamp;
    }
}
