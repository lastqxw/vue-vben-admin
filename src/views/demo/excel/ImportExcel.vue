<template>
  <div class="m-4">
    <ImportExcel @success="loadDataSuccess">
      <a-button class="m-3">导入Excel</a-button>
    </ImportExcel>
    <BasicTable
      v-for="(table, index) in tableListRef"
      :key="index"
      :title="table.title"
      :columns="table.columns"
      :dataSource="table.dataSource"
    ></BasicTable>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';

  import { ImportExcel, ExcelData } from '/@/components/Excel';
  import { BasicTable, BasicColumn } from '/@/components/Table';

  export default defineComponent({
    components: { BasicTable, ImportExcel },

    setup() {
      const tableListRef = ref<
        {
          title: string;
          columns?: any[];
          dataSource?: any[];
        }[]
      >([]);

      function loadDataSuccess(excelDataList: ExcelData[]) {
        tableListRef.value = [];
        console.log(excelDataList);
        for (const excelData of excelDataList) {
          const {
            header,
            results,
            meta: { sheetName },
          } = excelData;
          const columns: BasicColumn[] = [];
          for (const title of header) {
            columns.push({ title, dataIndex: title });
          }
          tableListRef.value.push({ title: sheetName, dataSource: results, columns });
        }
      }

      return {
        loadDataSuccess,
        tableListRef,
      };
    },
  });
</script>
