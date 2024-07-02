import { ref, defineComponent, onMounted } from 'vue';
import VueApexCharts from "vue3-apexcharts";
import { useAuth } from '../../stores/auth';
import axios from "axios";

export default defineComponent({
components: {
apexchart: VueApexCharts,
},
setup() {
const headers = useAuth().headers();
const contact = ref([]);

const activeTab = ref('tabItem1');
const chartOptions = ref();
const chartSeries = ref();

const selectDate = ref(1);

const options = ref([
{
id: 1,
label: 'Últimos 7 días'
},
{
id: 2,
label: 'Este mes'
},
{
id: 3,
label: 'Personalizado'
}
]);

chartOptions.value = {
chart: {
toolbar: {
show: false,
}
},

dataLabels: {
enabled: true,
dropShadow: {
enabled: true,
left: 1,
top: 1,
opacity: 0.3
}
},

plotOptions: {
bar: {
horizontal: true,
endingShape: "rounded",
borderRadius: 2
}
},

grid: {
position: 'front',
padding: {
top: -27,
right: 0,
bottom: -6,
left: 0
},
yaxis: {
lines: {
show: false
},
},
xaxis: {
lines: {
show: false
},
},
},

xaxis: {
labels: {
show: false,
},
},

yaxis: {
min: 0,
max: 100,
labels: {
show: true,
minWidth: 0,
maxWidth: 160,
style: {
colors: [],
fontSize: '12px',
fontFamily: 'Segoe UI',
fontWeight: 400,
cssClass: 'apexcharts-yaxis-label',
},
}
},
colors: ['#F8BC02'],
};

chartSeries.value = [
{
name: '',
data: [],
}
];

const handleSelectChange = (option_value: number) => {
if (option_value === 3) {
openModal();
}
};

const openModal = () => {
const myModalElement = document.getElementById('personalizado');
if (myModalElement) {
// const myModal = new bootstrap.Modal(myModalElement);
// myModal.show();
selectDate.value = 1;
}
};

const changeTab = (tabId: any) => {
activeTab.value = tabId;
};

// Traer datos de contactos
const contacts = async () => {
const getData = await axios.get(`${import.meta.env.VITE_API_URL}/reports/new_contacts/1`, headers);
contact.value = await getData.data.data;

console.log(getData.data);
};

contacts();

onMounted(async () => {
try {
const salesByMonth = [
{
"mes": " Dom",
"total": 100,
},
{
"mes": "Sáb",
"total": 1,
},
{
"mes": "Vie",
"total": 8,
},
{
"mes": "Jue",
"total": 3,
},
{
"mes": "Mié",
"total": 7,
},
{
"mes": "Mar",
"total": 2,
},
{
"mes": "Lun",
"total": 5,
},
];

const categories = salesByMonth.map(sale => sale.mes);
const data = salesByMonth.map(sale => sale.total);

chartOptions.value.xaxis.categories = categories;
chartSeries.value[0].data = data;

} catch (error) {
console.log(error);
}
});

return {
selectDate,
options,
handleSelectChange,
changeTab,
activeTab,
chartOptions,
chartSeries,
};

}
});
