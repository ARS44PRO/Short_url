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
                        name: 'originalUrl',
                        type: 'text',
                        isNullable: false
                    },
                    {
                        name: 'expiresAt',
                        type: 'date',
                        isNullable: true
                    },
                    {
                        name: 'alias',
                        type: 'varchar',
                        isNullable: true,
                        length: '20'
                    },
                    {
                        name: 'shortUrl',
                        type: 'text',
                        isNullable: false
                    },
                    {
                        name: 'createdAt',
                        type: 'date',
                        default: 'CURRENT_DATE'
                    },
                    {
                        name: 'clickCount',
                        type: 'int',
                        default: 0
                    }
                ]
            }), true
        );

        await queryRunner.createIndex(
            'urls',
            new typeorm.TableIndex({
                name: 'IDX_SHORT_URL',
                columnNames: ['shortUrl'],
                isUnique: true
            })            
        );

        await queryRunner.createTable(
            new typeorm.Table({
                name:'url_ip',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment'
                    },
                    {
                        name: 'ip',
                        type: 'text',
                        isNullable: false
                    },
                    {
                        name: 'click_date',
                        type: 'date',
                        default: 'CURRENT_DATE'
                    },
                    {
                        name: 'shortUrl',
                        type: 'text',
                        isNullable: false
                    }
                ]
            }), true
        );

        await queryRunner.createForeignKey(
            'url_ip',
            new typeorm.TableForeignKey({
                columnNames: ['shortUrl'],
                referencedColumnNames: ['shortUrl'],
                referencedTableName: 'urls',
                onDelete: 'CASCADE'
            })
        );
    }

    public async down(queryRunner: typeorm.QueryRunner): Promise<void> {
        await queryRunner.dropTable('url_ip', true);
        await queryRunner.dropTable('urls', true);
    }
}
