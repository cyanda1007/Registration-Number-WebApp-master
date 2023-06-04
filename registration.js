module.exports = function registration(dataBase) {
    
    const pool =  dataBase;
    let regChar = "";
    let errorMsg = "";
    let regex = /^((CA|CJ|CY|CL)\s\d{3}\-\d{3})$|^((CA|CJ|CY|CL)\s\d{3}\d{3})$|^((CA|CJ|CY|CL)\s\d{3}\s\d{3})$/;

    var allTown = (reg_Num) => { 
        regChar = "";
        if(reg_Num === "capetown"){
            regChar = "CA";
        }else if (regChar === "stellenbosch"){
            regChar = "CL";
        }else if (regChar === "bellville"){
            regChar = "CY";
        }else if (regChar === "paarl"){
            regChar = "CJ"
        }

    }
    var getTown = () =>{
        return regChar
    }
    async function setRegisration(registration){
        if (registration !== ""){
            let NumPlate = registration.toUpperCase();
            let regNum = NumPlate.substring(0,2);

            if(NumPlate.match(regex)){
                const Row = await pool.query('SELECT town_id FROM regByTown WHERE town_code = $1', [regNum]);
                const code = Row.rows;
                const town_ID = code[0].town_id;

                await regChekc(NumPlate, town_ID);
            }else{
                errorMsg = "Plese enter correct format for registation Number!";
            }
        }else{
            errorMsg = "please enter registation Number!";
        }
    }
    
    async function regChekc(registration, town_Id){
        const allRegistration = await pool.query("SELECT * FROM regNumbers WHERE reg_number = $1", [registration]);

        if (allRegistration.rows.length == 0){
            await pool.query("INSERT INTO regNumbers (reg_number, town_id)  VALUES ($1, $2)",[registration, town_Id]);
            errorMsg = "Registration Number has been succefully added";
        }else{
            errorMsg = "Registration number already exists";
        }
    }

    async function filter(reg_Town) {
		if (reg_Town != '') {
			const town = reg_Town;
			const Row = await pool.query('SELECT * FROM regByTown WHERE town_code = $1', [town]);
			const Town = Row.rows;
			const town_Id = Town[0].id;

			const getFiltered = await pool.query('SELECT reg_number, town_id FROM regNumbers WHERE town_id = $1', [town_Id]);

			return getFiltered.rows;
		} else {
			errorMsg = 'Please selecte the Town';
			return [];
		}
	}

    async function storeData() {
        const store = await pool.query("SELECT reg_number, town_id FROM regNumbers");
        return store.rows;
    }

    var addedReg = () =>{
        if(errorMsg == "Registration number has been succcesfully added"){
            return "succcesfull";
        }else{
            return "try again"
        }
    }

    var getMsg = () =>{
        return errorMsg;
    }

    function clearMsg() {
		message = '';
	}
    
    async function resetBtn(){
		return pool.query('DELETE FROM regNumbers');
	}
    return {
        allTown,
        getTown,
        setRegisration,
        regChekc,
        filter,
        storeData,
        addedReg,
        getMsg,
        clearMsg,
        resetBtn
    }
}



