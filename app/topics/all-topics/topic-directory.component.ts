export class TopicDirectory{
	expanded = false;

	constructor(public mainTopic:string, public directories:Array<TopicDirectory>, public subTopics:Array<string>)
	{

	}

	toggle()
	{
		this.expanded = !this.expanded;
	}

	getIcon()
	{
		if(this.expanded)
		{
			return '-';
		}
		else
		{
			return '+';
		}
	}

}