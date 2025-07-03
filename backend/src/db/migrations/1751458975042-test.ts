import * as typeorm from 'typeorm';

export class Test1751458975042 implements typeorm.MigrationInterface {

    public async up(queryRunner: typeorm.QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new typeorm.Table({
                name: 'urls',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment'
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        length: '255'
                    }
                ]
            }), true
        );
        console.log('Table urls created');
    }

    public async down(queryRunner: typeorm.QueryRunner): Promise<void> {
        await queryRunner.dropTable('urls');
        console.log('Table urls dropped');
    }
}
