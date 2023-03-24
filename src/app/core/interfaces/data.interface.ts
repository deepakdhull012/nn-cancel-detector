export interface IData {
    length: number;
    width: number;
    typeEarth: 1 | 0;
    typeMars: 1 | 0;
}

export interface ILungCancerData {
    Gender: number,
    AGE: number,
    SMOKING: number
    YELLOW_FINGERS: number,
    ANXIETY: number,
    PEER_PRESSURE: number
    CHRONIC_DISEASE: number
    FATIGUE: number,
    ALLERGY: number
    WHEEZING: number,
    ALCOHOL_CONSUMING: number,
    COUGHING: number,
    SHORTNESS_OF_BREATH: number,
    SWALLOWING_DIFFICULTY: number,
    CHEST_PAIN: number,
    LUNG_CANCER: number,
    accuracy_score: number;
    n1_score: number;
    n2_score: number;
}