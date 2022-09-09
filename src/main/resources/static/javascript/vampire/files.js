import { setDisciplines } from './vampire.js';


function loadAppData() {
	$.getJSON('/appdata/vampire/disciplines.json', function( data ) {
		setDisciplines( data );
	});
}

export { loadAppData };