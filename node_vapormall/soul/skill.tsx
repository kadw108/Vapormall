import {SkillData} from "../data/skills";

class Skill{
    data: SkillData;
    pp: number;

    constructor(skill_data: SkillData) {
        this.data = skill_data;
        this.pp = skill_data.max_pp;
    }

    private SkillButton(): JSX.Element {
        return (
            <button type="button" className={"skill-button outlineDiv skill-" + this.data.type}>
                {this.data.name}
                <br/>
                <small>{this.data.type }</small>
                <small>{this.pp}/{this.data.max_pp}</small>
            </button>
        );
    }

    private SkillTip(): JSX.Element {
        return (
            <div className="bottomhalf-tip outlineDiv hoverDiv hidden">
                {this.data.name}
                <p>{this.data.type} | {this.data.meta.category}</p>
                <hr/>
                {(this.data.power !== null) &&
                    <p>Power: {this.data.power}</p>
                }
                <hr/>
                <p>{this.data.description}</p>
            </div>
        );
    }

    public SkillContainer() {
        const skillButton = <this.SkillButton/>
        const skillTip = <this.SkillTip/>

        skillButton.onmouseover = function(){
            skillTip.style.display = "block";
        }
        skillButton.onmouseout = function(){
            skillTip.style.display = "none";
        }

        return <div className="choice-wrapper">
            {skillButton}{skillTip}
        </div>
    }
}

export {
    Skill
};